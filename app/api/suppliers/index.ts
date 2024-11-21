import { GET_SUPPLIER_ROUTE } from "@/constants/api-routes";
import { FilterParam, QueryParams } from "@/libs/types/backend";
import { GetSupplierResponse } from "./suppliers.type";

export const getSupplier = async (
  accessToken: string | null | undefined,
  queryParams: QueryParams
) => {
  const {
    page = 1,
    limit = 20,
    query = "",
    createdOn = "",
    createdOnMin = "",
    createdOnMax = "",
    assignIds = "",
    active = "",
  } = queryParams;

  const params = {
    [FilterParam.PAGE]: page.toString(),
    [FilterParam.LIMIT]: limit.toString(),
    [FilterParam.QUERY]: query ? query : "",
    [FilterParam.CREATED_ON]: createdOn ? createdOn : "",
    [FilterParam.CREATED_ON_MIN]: createdOnMin ? createdOnMin : "",
    [FilterParam.CREATED_ON_MAX]: createdOnMax ? createdOnMax : "",
    [FilterParam.ASSIGN_IDS]: assignIds ? assignIds : "",
    [FilterParam.ACTIVE]: active ? active : "",
  };

  const search = new URLSearchParams(params).toString();
  try {
    const url = `${GET_SUPPLIER_ROUTE}?${search}`;

    const res = await fetch(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (res.ok) {
      return data as GetSupplierResponse;
    }

    throw new Error(data.error ?? "Đã xảy ra lỗi");
  } catch (error: any) {
    throw new Error(error.message ?? "Đã xảy ra lỗi");
  }
};
