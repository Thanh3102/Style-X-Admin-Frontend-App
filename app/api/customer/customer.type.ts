import { PaginitionData } from "@/libs/types/backend/response";

export type GetCustomerResponse = {
  customers: {
    id: string;
    code: string;
    name: string;
    email: string;
    createdAt: string;
    numberOfOrder: number;
    totalOrderRevenue: number;
  }[];
  paginition: PaginitionData;
};

export type CustomerDetail = {
  code: string;
  name: string;
  gender: string;
  dob: Date;
  email: string;
  createdAt: Date;
  orders: {
    id: string;
    code: string;
    totalItemAfterDiscount: number;
    province: string;
    district: string;
    ward: string;
    address: string;
    paymentMethod: string;
    status: string;
    transactionStatus: string;
    createdAt: Date;
  }[];
};
