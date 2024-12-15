import {
  CANCEL_ORDER,
  CONFIRM_DELIVERY_ORDER,
  CONFIRM_PAYMENT_RECEIVE,
  DELETE_ORDER,
  GET_ORDER_DETAIL,
  GET_ORDER_LIST,
} from "@/constants/api-routes";
import {
  CancelOrderDto,
  ConfirmDeliveryDto,
  ConfirmPaymentDto,
  FormatOrderDetail,
  RequestOrderData,
} from "./order.type";
import { QueryParams } from "@/libs/types/backend";

export const GetOrderList = async (
  params: QueryParams,
  accessToken: string | null | undefined
) => {
  const search = new URLSearchParams(params);
  const url = `${GET_ORDER_LIST}?${search.toString()}`;
  try {
    const res = await fetch(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      cache: "no-cache",
    });

    const response = await res.json();

    if (res.ok) {
      return response as RequestOrderData;
    }

    throw new Error(response.message);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const GetOrderDetail = async (
  orderId: string,
  accessToken: string | null | undefined
) => {
  const url = `${GET_ORDER_DETAIL}/${orderId}`;
  try {
    const res = await fetch(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      cache: "no-cache",
    });

    const response = await res.json();

    if (res.ok) {
      return response as FormatOrderDetail;
    }

    throw new Error(response.message);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const confirmDelivery = async (
  data: ConfirmDeliveryDto,
  accessToken: string | null | undefined
) => {
  try {
    const res = await fetch(CONFIRM_DELIVERY_ORDER, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
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

export const CancelOrder = async (
  data: CancelOrderDto,
  accessToken: string | null | undefined
) => {
  try {
    const res = await fetch(CANCEL_ORDER, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
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

export const ConfirmPayment = async (
  data: ConfirmPaymentDto,
  accessToken: string | null | undefined
) => {
  try {
    const res = await fetch(CONFIRM_PAYMENT_RECEIVE, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
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

export const DeleteOrder = async (
  orderId: string,
  accessToken: string | null | undefined
) => {
  try {
    const res = await fetch(`${DELETE_ORDER}/${orderId}`, {
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

