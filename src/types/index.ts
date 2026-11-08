export type Locale = "en" | "sw";

export interface NavItem {
  key: string;
  href: string;
  external?: boolean;
}

export interface ShowroomContact {
  phone: string;
  displayPhone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  mapsUrl: string;
  whatsappNumber: string;
}

export interface MotionComponentBaseProps {
  className?: string;
  children?: React.ReactNode;
}

