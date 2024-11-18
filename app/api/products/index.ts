import {
  GET_PRODUCT_ROUTE,
  GET_VARIANT_DETAIL_ROUTE,
} from "@/constants/api-routes";
import { GetProductResponse, GetVariantDetailResponse } from "./products.type";
import { FilterParam, QueryParams } from "@/libs/types/backend";
import { isInteger } from "@/libs/helper";

export const getProduct = async (
  accessToken: string | undefined | null,
  params: QueryParams
) => {
  const {
    page: pg = "",
    limit: lim = "",
    query = "",
    createdOn = "",
    createdOnMin = "",
    createdOnMax = "",
    assignIds = "",
  } = params;

  const page = isInteger(pg) ? parseInt(pg) : 1;
  const limit = isInteger(lim) ? parseInt(lim) : 10;

  try {
    const params = {
      [FilterParam.PAGE]: page.toString(),
      [FilterParam.LIMIT]: limit.toString(),
      [FilterParam.QUERY]: query ? query : "",
      [FilterParam.CREATED_ON]: createdOn ? createdOn : "",
      [FilterParam.CREATED_ON_MIN]: createdOnMin ? createdOnMin : "",
      [FilterParam.CREATED_ON_MAX]: createdOnMax ? createdOnMax : "",
      [FilterParam.ASSIGN_IDS]: assignIds ? assignIds : "",
    };

    const paramString = new URLSearchParams(params);
    const url = `${GET_PRODUCT_ROUTE}?` + paramString.toString();

    const res = await fetch(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (res.ok) {
      return data as GetProductResponse;
    }

    throw new Error(data.error || data.message || "Đã xảy ra lỗi");
  } catch (error: any) {
    throw new Error(error.message ?? "Đã xảy ra lỗi");
  }
};

export const getVariantDetail = async (
  variantId: string | number,
  accessToken: string | null | undefined
) => {
  try {
    const res = await fetch(GET_VARIANT_DETAIL_ROUTE(variantId), {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      return data as GetVariantDetailResponse;
    }

    throw new Error(data.error || data.message || "Đã xảy ra lỗi");
  } catch (error: any) {
    throw new Error(error?.message ?? "Đã xảy ra lỗi");
  }
};
