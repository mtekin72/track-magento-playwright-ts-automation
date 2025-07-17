// Navigation types
export type NavigationItem = 'Women' | 'Men' | 'Gear' | 'Training' | 'Sale';
export type ClothingSubCategory = 'Tops' | 'Bottoms';
export type ProductType = 'Jackets' | 'Hoodies & Sweatshirts' | 'Tees' | 'Bras & Tanks' | 'Pants' | 'Shorts';
export type GearSubCategory = 'Bags' | 'Fitness Equipment' | 'Watches';

// Filter types
export type FilterType = 'size' | 'color' | 'price' | 'eco_collection' | 'activity';
export type SizeFilter = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type ColorFilter = 'Blue' | 'Red' | 'Green' | 'Yellow' | 'Black' | 'White' | 'Orange' | 'Purple';
export type ActivityFilter = 'Yoga' | 'Running' | 'Training' | 'Hiking' | 'Swimming';

// Checkout types
export type CountryCode = 'NL' | 'US' | 'CA' | 'GB' | 'DE' | 'FR';
export type ShippingMethod = 'Fixed' | 'Table Rate' | 'Free';

// Address types
export interface ShippingAddress {
  street: string;
  city: string;
  postcode: string;
  phone: string;
  country?: CountryCode;
  region?: string;
}

// Product types
export interface ProductDetails {
  name: string;
  price: string;
  size?: SizeFilter;
  color?: ColorFilter;
  quantity: number;
}

// Cart types
export interface CartItem {
  name: string;
  price: string;
  quantity: number;
  total: string;
} 