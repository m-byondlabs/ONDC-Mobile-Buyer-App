export type ProductModel = {
  id: string;
  name: string;
  unitizedValue: string;
  price: string;
  currency: string;
  imageUrl?: string;
  search?: boolean;
  domain: string;
  tags: string[];
};
