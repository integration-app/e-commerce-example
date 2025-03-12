export interface LineItem {
  uuid: string;
  name?: string;
  quantity: string;
}

export interface ShipmentDetails {
  recipient: {
    customer_id?: string;
    display_name: string;
    email_address?: string;
    address?: {
      country?: string;
    };
  };
  tracking_number: string;
}

export interface Fulfillment {
  uuid: string;
  type?: string;
  state: string;
  shippment_details: ShipmentDetails;
}

export interface Order {
  id: string;
  fields: {
    id: string;
    state: string;
    fulfillments: Fulfillment[];
    line_items?: LineItem[];
  };
  createdTime: string;
  updatedTime: string;
}

export interface OrdersResponse {
  records: Order[];
}
