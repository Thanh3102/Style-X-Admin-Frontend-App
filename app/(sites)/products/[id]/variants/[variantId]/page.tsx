import FormEditVariant from "@/components/specific/forms/FormEditVariant";
import ErrorPage from "@/components/ui/ErrorPage";
import GoBackButton from "@/components/ui/GoBackButton";
import LoadingCard from "@/components/ui/Loading";
import PageTitle from "@/components/ui/PageTitle";
import { GET_PRODUCT_DETAIL_ROUTE } from "@/constants/api-routes";
import { ProductRoute } from "@/constants/route";
import { isInteger } from "@/libs/helper";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";
import { GetProductDetailResponse } from "@/libs/types/backend/response";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import toast from "react-hot-toast";
import { any } from "zod";

const getProductDetail = async (id: number) => {
  try {
    const session = await getServerSession(nextAuthOptions);
    const res = await fetch(`${GET_PRODUCT_DETAIL_ROUTE}/${id}`, {
      headers: {
        authorization: `Bearer ${session?.accessToken}`,
      },
      cache: "no-cache",
    });
    if (res.ok) {
      const data = (await res.json()) as GetProductDetailResponse;
      return {
        product: data,
      };
    }
    const data = await res.json();
    return {
      product: null,
      error: data.error ?? "Đã xảy ra lỗi",
    };
  } catch (error: any) {
    console.log(error);
    return {
      product: null,
      error: error.message ?? "Đã xảy ra lỗi",
    };
  }
};

type Props = { params: { id: string; variantId: string } };

const Page = async ({ params: { id, variantId } }: Props) => {
  if (!isInteger(id)) {
    toast.error("Sản phẩm không hợp lệ");
    redirect(ProductRoute);
  }

  const { product, error } = await getProductDetail(parseInt(id));

  if (error || !product) return <ErrorPage />;

  const variant = product.variants.find(
    (vari) => vari.id === parseInt(variantId)
  );

  if (!variant) {
    redirect(`${ProductRoute}`);
  }

  return (
    <>
      <div className="px-16 mb-5">
        <div className="flex gap-4 items-center">
          <GoBackButton href={`${ProductRoute}/${id}`} />
          <PageTitle>{variant.title}</PageTitle>
        </div>
        <Suspense fallback={<LoadingCard />}>
          <FormEditVariant product={product} variant={variant} />
        </Suspense>
      </div>
    </>
  );
};
export default Page;
