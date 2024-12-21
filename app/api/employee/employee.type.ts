import { PaginitionData } from "@/libs/types/backend/response";

export type Employee = {
  id: number;
  code: string;
  username: string;
  name: string;
  email: string;
  gender: boolean;
  dateOfBirth: string;
  createdAt: string;
  lastLoginAt: null | string;
  phoneNumber: string;
  isEmployed: boolean;
  roleId: number;
};

export type GetEmployeesResponse = {
  employees: Employee[];
  paginition: PaginitionData;
};

export type CreateEmployeeDto = {
  name: string;
  roleId: number;
  email: string;
  phoneNumber: string;
  gender: number;
  dateOfBirth: Date;
};

export type UpdateEmployeeDto = {
  id: number;
  name: string;
  roleId?: number;
  email: string;
  phoneNumber: string;
  gender: number;
  dateOfBirth: Date;
  isEmployed?: boolean;
};
