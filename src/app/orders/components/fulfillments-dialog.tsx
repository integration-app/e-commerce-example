import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Order } from "@/types/order";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FulfillmentsDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FulfillmentsDialog({
  order,
  open,
  onOpenChange,
}: FulfillmentsDialogProps) {
  if (!order) return null;
  console.log(order);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Order Fulfillments - {order.fields.id}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>UUID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Tracking Number</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.fields.fulfillments.map((fulfillment, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-sm">
                    {fulfillment.uuid}
                  </TableCell>
                  <TableCell>{fulfillment.type}</TableCell>
                  <TableCell>{fulfillment.state}</TableCell>
                  <TableCell>
                    {fulfillment.shippment_details.recipient.display_name}
                  </TableCell>
                  <TableCell>
                    {fulfillment.shippment_details.tracking_number}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
