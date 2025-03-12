import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/server-auth";
import { getIntegrationClient } from "@/lib/integration-app-client";

export async function POST(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth.customerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get Integration.app client
    const client = await getIntegrationClient(auth);

    // Find the Square connection
    const connectionsResponse = await client.connections.find({
      key: "square",
    });
    const squareConnection = connectionsResponse.items?.[0];

    if (!squareConnection) {
      return NextResponse.json(
        { error: "No Square connection found" },
        { status: 400 }
      );
    }

    // Get orders from Square via Integration.app
    let result = await client.connection("square").action("get-orders").run({});

    if (result.output.records.length === 0 && result.output.cursor) {
      result = await client
        .connection("square")
        .action("get-orders")
        .run({ cursor: result.output.cursor });
    }

    return NextResponse.json(result.output, { status: 200 });
  } catch (error) {
    console.error("Error importing orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
