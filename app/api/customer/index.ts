import {
  CUSTOMER_GET_ROUTE,
  GET_CUSTOMER_DETAIL_ROUTE,
} from "@/constants/api-routes";
import { QueryParams } from "@/libs/types/backend";
import { CustomerDetail, GetCustomerResponse } from "./customer.type";

export const GetCustomer = async (
  query: QueryParams,
  accessToken: string | null | undefined
) => {
  try {
    const search = new URLSearchParams(query).toString();
    const url = `${CUSTOMER_GET_ROUTE}?${search}`;
    const res = await fetch(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    const response = await res.json();
    if (res.ok) {
      return response as GetCustomerResponse;
    }
    throw new Error(response.error);
  } catch (error) {
    throw error;
  }
};

export const GetCustomerDetail = async (
  customerId: string,
  searchParams: QueryParams,
  accessToken: string | null | undefined
) => {
  try {
    const search = new URLSearchParams(searchParams).toString();
    const url = `${GET_CUSTOMER_DETAIL_ROUTE}/${customerId}?${search}`;
    const res = await fetch(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    const response = await res.json();
    if (res.ok) {
      return response as CustomerDetail;
    }
    throw new Error(response.error);
  } catch (error) {
    throw error;
  }
};
