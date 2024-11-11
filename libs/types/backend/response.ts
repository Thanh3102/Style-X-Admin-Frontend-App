import { UserBasic } from "../user";

export type PaginitionData = {
  total: number;
  count: number;
  page: number;
  limit: number;
};

export type ResponseUser = {
  id: string;
  name: string;
  email: string;
  gender: boolean;
  dateOfBirth: Date;
  createdAt: Date;
  lastLoginAt: Date;
  phoneNumber: string;
};

export type GetUsersResponse = {
  users: ResponseUser[];
  paginition: {
    total: number;
    totalPage: number;
    hasMore: boolean;
  };
};

export type SupplierResponse = {
  id: number;
  code: string;
  name: string;
  phoneNumber: string | null;
  email: string | null;
  active: boolean;
};

export type GetSupplierResponse = {
  suppliers: SupplierResponse[];
  paginition: PaginitionData;
};
