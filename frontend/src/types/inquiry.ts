import type { PropertyImage } from "./property";

export interface Inquiry {
  id: number;
  message: string;
  phone: string;
  createdAt: string;
  senderId: number;
  propertyId: number;

  property: {
    id: number;
    title: string;
    price: number;
    currency: "USD" | "UZS";
    city: string;
    images: PropertyImage[];
  };
}

/** Seller'ga kelgan murojaat: yuboruvchi ma'lumoti bilan. */
export interface ReceivedInquiry extends Inquiry {
  sender: {
    id: number;
    fullName: string;
    email: string;
  };
}