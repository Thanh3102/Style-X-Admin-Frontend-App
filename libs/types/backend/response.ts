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
