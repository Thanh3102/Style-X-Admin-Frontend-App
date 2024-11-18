import { GET_WAREHOUSE_ROUTE } from "@/constants/api-routes";
import { GetWarehousesResponse } from "@/libs/types/backend/response";
import { getSession } from "next-auth/react";

export const getWarehouse = async () => {
  try {
    const session = await getSession();
    const res = await fetch(`${GET_WAREHOUSE_ROUTE}`, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
      cache: "force-cache",
    });

    const data = await res.json();

    if (res.ok) {
      return data as GetWarehousesResponse;
    }

    throw new Error(data.error ?? "Đã xảy ra lỗi");
  } catch (error: any) {
    throw new Error(error.message ?? "Đã xảy ra lỗi");
  }
};
