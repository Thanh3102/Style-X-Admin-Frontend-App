import { PaginitionData } from "@/libs/types/backend/response";

export type DetailDiscount = {
  id: number;
  type: string;
  mode: string;
  title: string;
  description: string;
  value: number;
  valueLimitAmount: null | number;
  valueType: string;
  entitle: string;
  prerequisite: string;
  prerequisiteMinTotal: null | number;
  prerequisiteMinItem: null | number;
  prerequisiteMinItemTotal: null | number;
  usageLimit: number | null;
  onePerCustomer: boolean;
  combinesWithProductDiscount: boolean;
  combinesWithOrderDiscount: boolean;
  startOn: string;
  endOn: null | string;
  active: boolean;
  summary: string;
  applyFor: string;
  usage: number;
  createdAt: string;
  updatedAt: string;
  createdUserId: number;
  createdUser: {
    name: string;
  };
  products: Array<{
    id: number;
    name: string;
    image: string | null;
  }>;
  variants: Array<{
    id: number;
    title: string;
    image: string | null;
    productId: number;
  }>;
  categories: Array<{
    id: number;
    title: string;
    collection: {
      id: number;
      title: string;
      slug: string | null;
      position: number;
    };
  }>;
};

export type GetDiscountResponse = {
  discounts: Array<{
    id: number;
    mode: string;
    active: boolean;
    startOn: string;
    endOn: string;
    createdAt: string;
    usage: number;
    usageLimit: number;
    combinesWithOrderDiscount: boolean;
    combinesWithProductDiscount: boolean;
    summary: string;
    title: string;
    type: string;
    void: boolean;
  }>;
  paginition: PaginitionData;
};
