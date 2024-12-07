import { getProductDetail } from "@/app/api/products";
import FormEditVariant from "@/components/specific/forms/FormEditVariant";
import ErrorPage from "@/components/ui/ErrorPage";
import GoBackButton from "@/components/ui/GoBackButton";
import LoadingCard from "@/components/ui/LoadingCard";
import PageTitle from "@/components/ui/PageTitle";
import { GET_PRODUCT_DETAIL_ROUTE } from "@/constants/api-routes";
import { ProductRoute } from "@/constants/route";
import { isInteger } from "@/libs/helper";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import toast from "react-hot-toast";

const getProductDetailData = async (id: number) => {
  try {
    const session = await getServerSession(nextAuthOptions);
    const data = await getProductDetail(id, session?.accessToken);
    return {
      product: data,
    };
  } catch (error: any) {
    return {
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

  const { product, error } = await getProductDetailData(parseInt(id));

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
