import { PaginitionData } from "@/libs/types/backend/response";

export type GetVariantDetailResponse = {
  id: number;
  title: string;
  skuCode: string;
  barCode: string | null;
  unit: string;
  void: boolean;
  sellPrice: number;
  costPrice: number;
  comparePrice: number;
  option1: string;
  option2: string;
  option3: string;
  createdAt: Date;
  updatedAt: Date;
  productId: number;
  image: string | null;
  warehouses: {
    id: number;
    name: string;
  }[];
  product: {
    name: string;
  };
};

export type ProductResponse = {
  id: number;
  name: string;
  skuCode: string;
  barCode: string;
  sellPrice: number;
  costPrice: number;
  comparePrice: number;
  avaiable: number;
  onHand: number;
  onTransaction: number;
  onReceive: number;
  type: string;
  vendor: string;
  image: string;
  createdAt: Date;
  variants: {
    id: number;
    skuCode: string;
    barCode: string | null;
    unit: string | null;
    comparePrice: number;
    sellPrice: number;
    costPrice: number;
    image: string | null;
    option1: string | null;
    option2: string | null;
    option3: string | null;
    title: string;
    createdAt: Date;
    avaiable: number;
    onHand: number;
    onTransaction: number;
    onReceive: number;
  }[];
};

export type GetProductResponse = {
  products: ProductResponse[];
  paginition: PaginitionData;
};

export type GetProductDetailResponse = {
  id: number;
  name: string;
  barCode: string | null;
  skuCode: string;
  avaiable: boolean;
  comparePrice: number;
  costPrice: number;
  sellPrice: number;
  type: string | null;
  unit: string | null;
  description: string | null;
  shortDescription: string | null;
  image: string;
  images: { url: string; publicId: string }[];
  variants: {
    id: number;
    title: string;
    barCode: string | null;
    skuCode: string;
    comparePrice: number;
    costPrice: number;
    sellPrice: number;
    unit: string | null;
    image: string;
    option1: string;
    option2: string;
    option3: string;
    inventories: {
      id: number;
      onHand: number;
      onReceive: number;
      onTransaction: number;
      avaiable: number;
      warehouse: {
        id: number;
        name: string;
      };
    }[];
  }[];
  options: { id: number; name: string; position: number; values: string[] }[];
  categories: { id: number; title: string }[];
  tags: string[];
};
