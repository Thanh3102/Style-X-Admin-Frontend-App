import {
  GET_INVENTORIES_HISTORY_ROUTE,
  GET_VARIANT_INVENTORIES_WAREHOUSES_ROUTE,
} from "@/constants/api-routes";
import {
  GetInventoriesHistoryResponse,
  GetVariantInventoryWarehousesResponse,
} from "./inventories.type";
import { FilterParam, QueryParams } from "@/libs/types/backend";
import { isInteger } from "@/libs/helper";

export const getVariantInventoryWarehouses = async (
  variantId: string | number,
  accessToken: string | null | undefined
) => {
  try {
    const res = await fetch(
      GET_VARIANT_INVENTORIES_WAREHOUSES_ROUTE(variantId),
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = (await res.json()) as GetVariantInventoryWarehousesResponse;
    return data;
  } catch (error: any) {
    throw new Error(error.message ?? "Đã xảy ra lỗi");
  }
};

export const getInventoriesHistory = async (
  accessToken: string | null | undefined,
  queryParams: QueryParams
) => {
  try {
    const paramString = new URLSearchParams(queryParams);
    const url = `${GET_INVENTORIES_HISTORY_ROUTE}?` + paramString.toString();
    const res = await fetch(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();
    if (res.ok) {
      return data as GetInventoriesHistoryResponse;
    }
    throw new Error(data.message);
  } catch (error: any) {
    throw new Error(error.message ?? "Đã xảy ra lỗi");
  }
};
