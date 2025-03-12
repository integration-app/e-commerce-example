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

interface Address {
  address_line_1: string;
  country: string;
}

interface Recipient {
  display_name: string;
  address: Address;
}

interface ShipmentDetails {
  recipient: Recipient;
  tracking_number: string;
  shipping_note?: string;
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
