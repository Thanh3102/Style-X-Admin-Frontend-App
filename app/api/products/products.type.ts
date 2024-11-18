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
  inventory_avaiable: number;
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
  }[];
};

export type GetProductResponse = {
  products: ProductResponse[];
  paginition: PaginitionData;
};
