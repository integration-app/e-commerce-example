import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order } from "@/types/order";
import { Skeleton } from "@/components/ui/skeleton";
import { FulfillmentsDialog } from "./fulfillments-dialog";
import { useState } from "react";

interface OrdersTableProps {
  orders: Order[];
  isLoading?: boolean;
  isError?: Error | null;
}

const calculateTotalItems = (order: Order): number => {
  if (!order.fields.line_items) return 0;
  return order.fields.line_items.reduce((total, item) => {
    return total + (parseInt(item.quantity) || 0);
  }, 0);
};

export function OrdersTable({
  orders,
  isLoading = false,
  isError = null,
}: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isError) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">
          Error loading orders. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Total Items</TableHead>
            <TableHead>Tracking Number</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-6 w-[200px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[150px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[80px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[120px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-[100px]" />
                </TableCell>
              </TableRow>
            ))
          ) : orders.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground"
              >
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow
                key={order.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => {
                  setSelectedOrder(order);
                  setIsDialogOpen(true);
                }}
              >
                <TableCell className="font-medium">{order.fields.id}</TableCell>
                <TableCell>{order.fields.state}</TableCell>
                <TableCell>
                  {order.fields.fulfillments[0]?.shippment_details.recipient
                    .display_name || "-"}
                </TableCell>
                <TableCell>{calculateTotalItems(order)}</TableCell>
                <TableCell>
                  {order.fields.fulfillments[0]?.shippment_details
                    .tracking_number || "-"}
                </TableCell>
                <TableCell>
                  {new Date(order.createdTime).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(order.updatedTime).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <FulfillmentsDialog
        order={selectedOrder}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
