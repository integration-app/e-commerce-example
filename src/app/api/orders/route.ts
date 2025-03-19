import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/server-auth";
import { getIntegrationClient } from "@/lib/integration-app-client";
import { verifyIntegrationAppToken } from "@/lib/integration-app-auth";

function generateTrackingNumber(): string {
  const prefix = "TN";
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth.customerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get Integration.app client
    const client = await getIntegrationClient(auth);

    // Get orders from Square via Integration.app
    const { searchParams } = request.nextUrl;
    const cursor = searchParams.get("cursor");
    let result = await client
      .connection("square")
      .action("get-orders")
      .run({ cursor });

    if (result.output.records.length === 0 && result.output.cursor) {
      result = await client
        .connection("square")
        .action("get-orders")
        .run({ cursor: result.output.cursor });
    }

    return NextResponse.json(result.output, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Try Integration.app token first
    const integrationAppAuth = await verifyIntegrationAppToken(request);
    if (!integrationAppAuth?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.externalOrderId || !body.data) {
      return NextResponse.json(
        { error: "externalOrderId and data are required" },
        { status: 400 }
      );
    }

    // Get Integration.app client with the customer ID from the token
    const auth = {
      customerId: integrationAppAuth.sub,
      customerName:
        (integrationAppAuth.fields?.name as string) || integrationAppAuth.sub,
    };

    // Get Integration.app client
    const client = await getIntegrationClient(auth);
    try {
      // Update order in Square via Integration.app
      const result = await client
        .connection("square")
        .action("update-order")
        .run({
          version: body.data.rawFields.version,
          id: body.externalOrderId,
          fulfillments: {
            type: "SHIPMENT",
            uid: body.data.rawFields.fulfillments[0].uid,
            shipment_details: {
              tracking_number: generateTrackingNumber(),
              recipient: {
                display_name: "Test Customer",
              },
            },
          },
        });
      return NextResponse.json(result.output, { status: 200 });
    } catch (apiError) {
      console.error("Integration.app API Error:", {
        error: apiError,
        requestBody: {
          orderId: body.externalOrderId,
          orderDataId: body.data?.id,
        },
      });
      return NextResponse.json(
        { error: "Failed to connect to Integration.app service" },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
