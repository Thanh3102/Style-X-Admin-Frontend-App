export type PaginitionData = {
  total: number;
  count: number;
  page: number;
  limit: number;
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
