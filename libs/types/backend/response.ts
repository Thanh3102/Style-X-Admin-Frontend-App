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


