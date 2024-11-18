import FormEditProduct from "@/components/specific/forms/FormEditProduct";
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

type Props = { params: { id: string } };

const getProductDetail = async (id: number) => {
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
};

async function Page({ params: { id } }: Props) {
  if (!isInteger(id)) {
    toast.error("Sản phẩm không hợp lệ");
    redirect(ProductRoute);
  }

  const { product, error } = await getProductDetail(parseInt(id));

  if (error || !product) return <ErrorPage />;

  return (
    <div className="px-28 mb-5">
      <div className="flex gap-4 items-center">
        <GoBackButton href={`${ProductRoute}`} />
        <PageTitle>{product.name}</PageTitle>
      </div>
      <Suspense fallback={<LoadingCard />}>
        <FormEditProduct product={product} />
      </Suspense>
    </div>
  );
}
export default Page;
