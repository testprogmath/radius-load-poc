export class CartRequest {
    lines: CartLine[];
    email: string;
    shipping_address: ShippingAddress;
    delivery_coordinates: DeliveryCoordinates;
    notes: string;
    delivery_eta: string;
    delivery_tier_id: string;
    shipping_method_id: string;

    constructor() {
        this.lines = [];
        this.email = '';
        this.shipping_address = new ShippingAddress();
        this.delivery_coordinates = new DeliveryCoordinates();
        this.notes = '';
        this.delivery_eta = '';
        this.delivery_tier_id = '';
        this.shipping_method_id = '';
    }
}

export class CartLine {
    variant_id: string;
    product_sku: string;
    quantity: number;

    constructor(variant_id: string, product_sku: string, quantity: number) {
        this.variant_id = variant_id;
        this.product_sku = product_sku;
        this.quantity = quantity;
    }
}

class ShippingAddress {
    first_name?: string;
    last_name?: string;
    street_address_1?: string;
    city?: string;
    postal_code: string;
    country?: string;
    phone?: string;
    tag?: string;

    constructor() {
        this.first_name = '';
        this.last_name = '';
        this.street_address_1 = '';
        this.city = '';
        this.postal_code = '';
        this.country = '';
        this.phone = '';
        this.tag = "";
    }
}

class DeliveryCoordinates {
    latitude: number;
    longitude: number;

    constructor() {
        this.latitude = 0;
        this.longitude = 0;
    }
}
