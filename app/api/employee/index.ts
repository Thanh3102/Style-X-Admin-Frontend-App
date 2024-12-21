import { QueryParams } from "@/libs/types/backend";
import {
  CreateEmployeeDto,
  GetEmployeesResponse,
  UpdateEmployeeDto,
} from "./employee.type";
import {
  CREATE_EMPLOYEE_ROUTE,
  DELETE_EMPLOYEE_ROUTE,
  EMPLOYEE_GET_ROUTE,
  UPDATE_EMPLOYEE_ROUTE,
} from "@/constants/api-routes";

export const GetEmployees = async (
  params: QueryParams,
  accessToken: string | undefined | null
) => {
  try {
    const search = new URLSearchParams(params).toString();
    const url = `${EMPLOYEE_GET_ROUTE}?${search}`;
    const res = await fetch(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const response = await res.json();

    if (res.ok) {
      return response as GetEmployeesResponse;
    }

    throw new Error(response.message ?? "Đã xảy ra lỗi");
  } catch (error) {
    throw error;
  }
};

export const createEmployee = async (
  dto: CreateEmployeeDto,
  accessToken: string | null | undefined
) => {
  try {
    const res = await fetch(CREATE_EMPLOYEE_ROUTE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(dto),
    });

    const response = await res.json();

    if (res.ok) {
      return response as { message: string };
    }

    throw new Error(response.message);
  } catch (error) {
    throw error;
  }
};

export const UpdateEmployee = async (
  dto: UpdateEmployeeDto,
  accessToken: string | null | undefined
) => {
  try {
    const res = await fetch(UPDATE_EMPLOYEE_ROUTE, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(dto),
    });

    const response = await res.json();

    if (res.ok) {
      return response as { message: string };
    }

    throw new Error(response.message);
  } catch (error) {
    throw error;
  }
};

export const DeleteEmployee = async (
  employeeId: number,
  accessToken: string | null | undefined
) => {
  try {
    const res = await fetch(`${DELETE_EMPLOYEE_ROUTE}/${employeeId}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    const response = await res.json();

    if (res.ok) {
      return response as { message: string };
    }

    throw new Error(response.message);
  } catch (error) {
    throw error;
  }
};
