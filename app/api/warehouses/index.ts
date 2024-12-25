import {
  GET_WAREHOUSE_ROUTE,
  WAREHOUSE_CREATE,
  WAREHOUSE_DETAIL,
} from "@/constants/api-routes";
import { QueryParams } from "@/libs/types/backend";
import {
  CreateWarehouseDto,
  GetWarehousesResponse,
  UpdateWarehouseDto,
  WarehouseDetail,
} from "./warehouses.type";

export const getWarehouse = async (
  accessToken: string | null | undefined,
  params?: QueryParams
) => {
  try {
    const search = new URLSearchParams(params);
    const url = `${GET_WAREHOUSE_ROUTE}?${search.toString()}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (res.ok) {
      return data as GetWarehousesResponse;
    }

    throw new Error(data.error ?? "Đã xảy ra lỗi");
  } catch (error: any) {
    throw error;
  }
};

export const CreateWarehouse = async (
  dto: CreateWarehouseDto,
  accessToken: string | null | undefined
) => {
  try {
    const res = await fetch(WAREHOUSE_CREATE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(dto),
    });

    const response = await res.json();

    if (res.ok) return response as { message: string };

    throw new Error(response.message);
  } catch (error) {
    throw error;
  }
};

export const UpdateWarehouse = async (
  dto: UpdateWarehouseDto,
  accessToken: string | null | undefined
) => {
  try {
    const res = await fetch(WAREHOUSE_CREATE, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(dto),
    });

    const response = await res.json();

    if (res.ok) return response as { message: string };

    throw new Error(response.message);
  } catch (error) {
    throw error;
  }
};

export const GetWarehouseDetail = async (
  warehouseId: number,
  accessToken: string | null | undefined,
  params?: QueryParams
) => {
  const search = new URLSearchParams(params);
  const url = `${WAREHOUSE_DETAIL(warehouseId)}?${search.toString()}`;
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const response = await res.json();

    if (res.ok) {
      return response as WarehouseDetail;
    }

    throw new Error(response.message);
  } catch (error) {
    throw error;
  }
};
