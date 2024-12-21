import { QueryParams } from "@/libs/types/backend";
import {
  ReportBestSale,
  ReportLowStock,
  ReportOverview,
  ReportProductRevenueDetailResponse,
  ReportRevenue,
  ReportRevenueDetailResponse,
} from "./report.type";
import {
  REPORT_BEST_SALE,
  REPORT_LOW_STOCK,
  REPORT_OVERVIEW,
  REPORT_PRODUCT_REVENUE_DETAIL,
  REPORT_REVENUE,
  REPORT_REVENUE_DETAIL,
} from "@/constants/api-routes";

export const GetReportOverview = async (
  params: QueryParams,
  accessToken: string | undefined | null
) => {
  try {
    const search = new URLSearchParams(params).toString();
    const url = `${REPORT_OVERVIEW}?${search}`;
    const res = await fetch(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const response = await res.json();

    if (res.ok) {
      return response as ReportOverview;
    }

    throw new Error(response.message);
  } catch (error) {
    throw error;
  }
};

export const GetReportRevenue = async (
  params: QueryParams,
  accessToken: string | undefined | null
) => {
  try {
    const search = new URLSearchParams(params).toString();
    const url = `${REPORT_REVENUE}?${search}`;
    const res = await fetch(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const response = await res.json();

    if (res.ok) {
      return response as ReportRevenue;
    }

    throw new Error(response.message);
  } catch (error) {
    throw error;
  }
};

export const GetBestSale = async (
  params: QueryParams,
  accessToken: string | undefined | null
) => {
  try {
    const search = new URLSearchParams(params).toString();
    const url = `${REPORT_BEST_SALE}?${search}`;
    const res = await fetch(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const response = await res.json();

    if (res.ok) {
      return response as ReportBestSale;
    }

    throw new Error(response.message);
  } catch (error) {
    throw error;
  }
};

export const GetLowStock = async (accessToken: string | undefined | null) => {
  try {
    const url = `${REPORT_LOW_STOCK}`;
    const res = await fetch(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const response = await res.json();

    if (res.ok) {
      return response as ReportLowStock;
    }

    throw new Error(response.message);
  } catch (error) {
    throw error;
  }
};

export const GetReportRevenueDetail = async (
  params: QueryParams,
  accessToken: string | undefined | null
) => {
  try {
    const search = new URLSearchParams(params).toString();
    const url = `${REPORT_REVENUE_DETAIL}?${search}`;
    const res = await fetch(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const response = await res.json();

    if (res.ok) {
      return response as ReportRevenueDetailResponse;
    }

    throw new Error(response.message);
  } catch (error) {
    throw error;
  }
};

export const GetReportProductRevenueDetail = async (
  params: QueryParams,
  accessToken: string | undefined | null
) => {
  try {
    const search = new URLSearchParams(params).toString();
    const url = `${REPORT_PRODUCT_REVENUE_DETAIL}?${search}`;
    const res = await fetch(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const response = await res.json();

    if (res.ok) {
      return response as ReportProductRevenueDetailResponse;
    }

    throw new Error(response.message);
  } catch (error) {
    throw error;
  }
};
