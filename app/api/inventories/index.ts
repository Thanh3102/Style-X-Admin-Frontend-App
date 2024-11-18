import { GET_INVENTORIES_HISTORY_ROUTE, GET_VARIANT_INVENTORIES_WAREHOUSES_ROUTE } from "@/constants/api-routes";
import { GetInventoriesHistoryResponse, GetVariantInventoryWarehousesResponse } from "./inventories.type";

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
  variantId: string | number,
  accessToken: string | null | undefined
) => {
try {
  const res = await fetch(GET_INVENTORIES_HISTORY_ROUTE(variantId), {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  const data = (await res.json()) as GetInventoriesHistoryResponse;
  return data;
} catch (error: any) {
  throw new Error(error.message ?? "Đã xảy ra lỗi");
}
};
