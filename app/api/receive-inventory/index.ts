import {
  GET_RECEIVE_INVENTORY,
  GET_RECEIVE_INVENTORY_DETAIL,
} from "@/constants/api-routes";
import {
  ReceiveInventoryDetail,
  ReceiveInventoryResponse,
} from "./receive-inventory.type";
import { FilterParam, QueryParams } from "@/libs/types/backend";
import { isInteger } from "@/libs/helper";

export const getReceiveInventoryDetail = async (
  receiveId: number | string,
  accessToken: string | null | undefined
) => {
  try {
    const res = await fetch(GET_RECEIVE_INVENTORY_DETAIL(receiveId), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      return data as ReceiveInventoryDetail;
    }

    throw new Error(data.error ?? "Đã xảy ra lỗi");
  } catch (error: any) {
    throw new Error(error.message ?? "Đã xảy ra lỗi");
  }
};

export const getReceiveInventory = async (
  queryParams: QueryParams,
  accessToken: string | null | undefined
) => {
  try {
    const param = new URLSearchParams(queryParams);
    const url = `${GET_RECEIVE_INVENTORY}?${param.toString()}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (res.ok) {
      return data as ReceiveInventoryResponse;
    }

    throw new Error(data.error ?? "Đã xảy ra lỗi");
  } catch (error: any) {
    throw new Error(error.message ?? "Đã xảy ra lỗi");
  }
};
