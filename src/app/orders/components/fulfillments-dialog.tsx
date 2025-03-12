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

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const calculateUnitPrice = (total: number, quantity: string) => {
    return total / parseInt(quantity);
  };

  const calculateTotalPrice = () => {
    return order.fields.line_items.reduce((sum, item) => {
      return sum + item.total_price.amount;
    }, 0);
  };

  const totalOrderPrice = calculateTotalPrice();
  const currency = order.fields.line_items[0]?.total_price.currency || "USD";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Order Details - {order.fields.id}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          {/* Line Items Section */}
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-semibold mb-4">Line Items</h3>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead className="text-foreground w-[40%]">
                    Name
                  </TableHead>
                  <TableHead className="text-foreground text-center">
                    Quantity
                  </TableHead>
                  <TableHead className="text-foreground text-right">
                    Unit Price
                  </TableHead>
                  <TableHead className="text-foreground text-right">
                    Total
                  </TableHead>
                  <TableHead className="text-foreground">Item ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.fields.line_items?.map((item) => (
                  <TableRow
                    key={item.uuid}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="text-foreground font-medium">
                      {item.name}
                    </TableCell>
                    <TableCell className="text-foreground text-center">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-foreground text-right">
                      {formatPrice(
                        calculateUnitPrice(
                          item.total_price.amount,
                          item.quantity
                        ),
                        item.total_price.currency
                      )}
                    </TableCell>
                    <TableCell className="text-foreground text-right">
                      {formatPrice(
                        item.total_price.amount,
                        item.total_price.currency
                      )}
                    </TableCell>
                    <TableCell className="text-foreground font-mono text-sm text-muted-foreground">
                      {item.uuid}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-end items-center gap-4">
                <span className="text-base font-semibold text-foreground">
                  Order Total:
                </span>
                <span className="text-lg font-bold text-foreground">
                  {formatPrice(totalOrderPrice, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Fulfillments Section */}
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-semibold mb-4">Fulfillments</h3>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead className="text-foreground">Type</TableHead>
                  <TableHead className="text-foreground">State</TableHead>
                  <TableHead className="text-foreground">Customer</TableHead>
                  <TableHead className="text-foreground">Address</TableHead>
                  <TableHead className="text-foreground">Tracking</TableHead>
                  <TableHead className="text-foreground">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.fields.fulfillments.map((fulfillment) => (
                  <TableRow
                    key={fulfillment.uuid}
                    className="hover:bg-muted/50 transition-colors"
                  >
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
                      <div className="space-y-1">
                        <div>
                          {
                            fulfillment.shippment_details.recipient.address
                              .address_line_1
                          }
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {
                            fulfillment.shippment_details.recipient.address
                              .country
                          }
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground font-mono text-sm">
                      {fulfillment.shippment_details.tracking_number}
                    </TableCell>
                    <TableCell className="text-foreground text-sm text-muted-foreground">
                      {fulfillment.shippment_details.shipping_note}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
