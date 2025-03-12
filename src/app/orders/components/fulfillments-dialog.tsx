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
      <DialogContent className="max-w-3xl bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Order Fulfillments - {order.fields.id}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-muted/50">
                <TableHead className="text-foreground">UUID</TableHead>
                <TableHead className="text-foreground">Type</TableHead>
                <TableHead className="text-foreground">State</TableHead>
                <TableHead className="text-foreground">Customer</TableHead>
                <TableHead className="text-foreground">
                  Tracking Number
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.fields.fulfillments.map((fulfillment, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-mono text-sm text-foreground">
                    {fulfillment.uuid}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {fulfillment.type}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {fulfillment.state}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {fulfillment.shippment_details.recipient.display_name}
                  </TableCell>
                  <TableCell className="text-foreground">
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
