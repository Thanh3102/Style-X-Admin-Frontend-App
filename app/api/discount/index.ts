import { CreateDiscountData } from "@/components/specific/forms/FormCreateDiscount";
import {
  DELETE_DISCOUNT,
  GET_DISCOUNT_DETAIL,
  GET_DISCOUNTS,
  POST_CREATE_DISCOUNT,
  PUT_UPDATE_DISCOUNT,
  PUT_UPDATE_DISCOUNT_ACTIVE,
} from "@/constants/api-routes";
import { DetailDiscount, GetDiscountResponse } from "./discount.type";
import { FilterParam, QueryParams } from "@/libs/types/backend";
import { isInteger } from "@/libs/helper";
import { UpdateDiscountData } from "@/components/specific/forms/FormEditDiscount";

export const CreateDiscount = async (
  data: CreateDiscountData,
  accessToken: string | null | undefined
) => {
  try {
    const res = await fetch(POST_CREATE_DISCOUNT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    const response = await res.json();
    if (res.ok) {
      return response as { id: string; message?: string };
    }

    throw new Error(response.message ?? "Đã xảy ra lỗi");
  } catch (error: any) {
    throw new Error(error.message ?? "Đã xảy ra lỗi");
  }
};

export const UpdateDiscount = async (
  data: UpdateDiscountData,
  accessToken: string | null | undefined
) => {
  try {
    const res = await fetch(PUT_UPDATE_DISCOUNT, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    const response = await res.json();
    if (res.ok) {
      return response as { message?: string };
    }

    throw new Error(response.message ?? "Đã xảy ra lỗi");
  } catch (error: any) {
    throw new Error(error.message ?? "Đã xảy ra lỗi");
  }
};

export const GetDiscountDetail = async (
  id: number,
  accessToken: string | null | undefined
) => {
  try {
    const res = await fetch(GET_DISCOUNT_DETAIL(id), {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    const response = await res.json();

    if (res.ok) {
      return response as DetailDiscount;
    }

    throw new Error(response.message ?? "Đã xảy ra lỗi");
  } catch (error: any) {
    throw new Error(error.message ?? "Đã xảy ra lỗi");
  }
};

export const GetDiscounts = async (
  queryParams: QueryParams,
  accessToken: string | null | undefined
) => {
  try {
  
    const paramString = new URLSearchParams(queryParams);
    const url = `${GET_DISCOUNTS}?` + paramString.toString();
    const res = await fetch(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store"
    });

    const response = await res.json();

    if (res.ok) {
      return response as GetDiscountResponse;
    }

    throw new Error(response.message ?? "Đã xảy ra lỗi");
  } catch (error: any) {
    throw new Error(error.message ?? "Đã xảy ra lỗi");
  }
};

export const UpdateDiscountActice = async (
  id: number,
  active: boolean,
  accessToken: string | null | undefined
) => {
  try {
    const res = await fetch(`${PUT_UPDATE_DISCOUNT_ACTIVE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        active: active,
      }),
    });

    const response = await res.json();
    if (res.ok) {
      return response as { message?: string };
    }

    throw new Error(response.message ?? "Đã xảy ra lỗi");
  } catch (error: any) {
    throw new Error(error.message ?? "Đã xảy ra lỗi");
  }
};

export const DeleteDiscount = async (
  id: number,
  accessToken: string | null | undefined
) => {
  try {
    const res = await fetch(`${DELETE_DISCOUNT}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });

    const response = await res.json();
    if (res.ok) {
      return response as { message?: string };
    }

    throw new Error(response.message ?? "Đã xảy ra lỗi");
  } catch (error: any) {
    throw new Error(error.message ?? "Đã xảy ra lỗi");
  }
};
