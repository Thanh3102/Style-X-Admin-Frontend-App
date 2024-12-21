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
  employees: ResponseUser[];
  paginition: {
    total: number;
    totalPage: number;
    hasMore: boolean;
  };
};






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
};

export type GetWarehousesResponse = Array<WarehousesResponse>
