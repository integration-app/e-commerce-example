interface Money {
  amount: number;
  currency: string;
}

interface LineItem {
  uuid: string;
  name: string;
  quantity: string;
  total_price: Money;
}

interface Recipient {
  display_name: string;
}

interface ShipmentDetails {
  recipient: Recipient;
  tracking_number: string;
}

interface Fulfillment {
  uuid: string;
  type: string;
  state: string;
  shippment_details: ShipmentDetails;
}

interface OrderFields {
  id: string;
  state: string;
  fulfillments: Fulfillment[];
  line_items: LineItem[];
  version: number;
}

export interface Order {
  id: string;
  fields: OrderFields;
  createdTime: string;
  updatedTime: string;
}

export interface OrdersResponse {
  records: Order[];
}
