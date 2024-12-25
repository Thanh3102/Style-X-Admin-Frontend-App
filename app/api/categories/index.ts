import { CreateCategoryData } from "@/components/specific/forms/FormCreateCategory";
import {
  DELETE_CATEGORY,
  DELETE_COLLECTION,
  GET_CATEGORY,
  GET_COLLECTIONS,
  POST_CREATE_CATEGORY,
  POST_CREATE_COLLECTION,
  POST_UPDATE_CATEGORY,
  PUT_UPDATE_COLLECTION,
} from "@/constants/api-routes";
import { isInteger } from "@/libs/helper";
import { FilterParam, QueryParams } from "@/libs/types/backend";
import { GetCategoryResponse, GetCollectionResponse } from "./categories.type";
import { EditCategoryData } from "@/components/specific/modals/EditCategoryModal";
import { CreateCollectionData } from "@/components/specific/forms/FormCreateCollection";
import { EditCollectionData } from "@/components/specific/modals/EditCollectionModal";

export const GetCategories = async (queryParams: QueryParams) => {
  try {
    const { page: pg = "", limit: lim = "", query = "" } = queryParams;

    const page = isInteger(pg) ? parseInt(pg) : 1;
    const limit = isInteger(lim) ? parseInt(lim) : 20;
    const params = {
      [FilterParam.PAGE]: page.toString(),
      [FilterParam.LIMIT]: limit.toString(),
      [FilterParam.QUERY]: query ? query : "",
    };

    const paramString = new URLSearchParams(params);
    const url = `${GET_CATEGORY}?` + paramString.toString();
    const res = await fetch(url, { cache: "no-store" });
    const response = await res.json();

    if (res.ok) {
      return response as GetCategoryResponse;
    }

    throw new Error(response.message ?? "Đã xảy ra lỗi khi lấy dữ liệu");
  } catch (error: any) {
    throw new Error(error.message ?? "Đã xảy ra lỗi khi lấy dữ liệu");
  }
};

export const CreateCategory = async (
  data: CreateCategoryData,
  token: string | null | undefined
) => {
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("slug", data.slug);
    formData.append("collectionId", data.collectionId.toString());
    if (data.image) formData.append("image", data.image[0]);

    const res = await fetch(POST_CREATE_CATEGORY, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const response = (await res.json()) as { message?: string };

    if (res.ok) {
      return response;
    }

    throw new Error(response.message ?? "Đã xảy ra lỗi khi tạo danh mục");
  } catch (error: any) {
    throw new Error(error.message ?? "Đã xảy ra lỗi khi tạo danh mục");
  }
};

export const UpdateCategory = async (
  data: EditCategoryData,
  token: string | null | undefined
) => {
  try {
    const formData = new FormData();
    formData.append("id", data.id.toString());
    formData.append("title", data.title);
    formData.append("slug", data.slug);
    formData.append("collectionId", data.collectionId.toString());
    if (data.image) {
      formData.append("image", data.image[0]);
    }

    const res = await fetch(POST_UPDATE_CATEGORY, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const response = (await res.json()) as { message?: string };

    if (res.ok) {
      return response;
    }

    throw new Error(response.message ?? "Đã xảy ra lỗi khi cập nhật danh mục");
  } catch (error: any) {
    throw new Error(error.message ?? "Đã xảy ra lỗi khi cập nhật danh mục");
  }
};

export const DeleteCategory = async (
  id: number,
  token: string | null | undefined
) => {
  try {
    const res = await fetch(`${DELETE_CATEGORY}/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const response = (await res.json()) as { message?: string };

    if (res.ok) {
      return response;
    }

    return response;
  } catch (error: any) {
    throw new Error(error.message ?? "Đã xảy ra lỗi khi xóa danh mục");
  }
};

export const GetCollections = async () => {
  try {
    const res = await fetch(GET_COLLECTIONS, { cache: "no-store" });
    const response = await res.json();

    if (res.ok) {
      return response as GetCollectionResponse;
    }

    throw new Error(response.message ?? "Đã xảy ra lỗi khi lấy dữ liệu");
  } catch (error: any) {
    throw new Error(error.message ?? "Đã xảy ra lỗi khi lấy dữ liệu");
  }
};

export const CreateCollection = async (
  data: CreateCollectionData,
  token: string | null | undefined
) => {
  try {
    const res = await fetch(POST_CREATE_COLLECTION, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const response = (await res.json()) as { message?: string };

    if (res.ok) {
      return response;
    }

    throw new Error(response.message ?? "Đã xảy ra lỗi khi thêm bộ sưu tập");
  } catch (error: any) {
    throw new Error(error.message ?? "Đã xảy ra lỗi khi thêm bộ sưu tập");
  }
};

export const UpdateCollection = async (
  data: EditCollectionData,
  token: string | null | undefined
) => {
  try {
    const res = await fetch(PUT_UPDATE_COLLECTION, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const response = (await res.json()) as { message?: string };

    if (res.ok) {
      return response;
    }

    throw new Error(response.message ?? "Đã xảy ra lỗi");
  } catch (error: any) {
    throw new Error(error.message ?? "Đã xảy ra lỗi");
  }
};

export const DeleteCollection = async (
  id: number,
  token: string | null | undefined
) => {
  try {
    const res = await fetch(`${DELETE_COLLECTION}/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const response = (await res.json()) as { message?: string };

    if (res.ok) {
      return response;
    }

    throw new Error(response.message);
  } catch (error: any) {
    throw error;
  }
};
