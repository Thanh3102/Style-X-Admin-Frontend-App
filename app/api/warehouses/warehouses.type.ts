import { PaginitionData } from "@/libs/types/backend/response";

export type WarehousesResponse = {
  id: number;
  name: string;
  code: string;
  phoneNumber: string;
  email: string;
  country: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  createdAt: Date;
  active: boolean;
};

export type GetWarehousesResponse = Array<WarehousesResponse>;

export type CreateWarehouseDto = {
  name: string;
  email: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  address: string;
};

export type UpdateWarehouseDto = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  active: boolean;
};

export type WarehouseDetail = {
  id: number;
  name: number;
  inventories: Array<{
    id: number;
    avaiable: number;
    onHand: number;
    onReceive: number;
    onTransaction: number;
    productVariant: {
      id: number;
      title: string;
      skuCode: string;
      barCode: string;
      product: {
        id: number;
        name: string;
        image: string | null;
      };
    };
  }>;
  paginition: PaginitionData;
};
