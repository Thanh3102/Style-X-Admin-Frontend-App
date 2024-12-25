import { getCurrentPermissions } from "@/app/api/customer";
import { getProductDetail } from "@/app/api/products";
import FormEditProduct from "@/components/specific/forms/FormEditProduct";
import AccessDeniedPage from "@/components/ui/AccessDeniedPage";
import ErrorPage from "@/components/ui/ErrorPage";
import GoBackButton from "@/components/ui/GoBackButton";
import LoadingCard from "@/components/ui/LoadingCard";
import PageTitle from "@/components/ui/PageTitle";
import RedirectToast from "@/components/ui/RedirectToast";
import { ProductRoute } from "@/constants/route";
import { isInteger } from "@/libs/helper";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";
import { ProductPermission } from "@/libs/types/backend";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type Props = { params: { id: string } };

const getProductDetailData = async (id: number) => {
  try {
    const session = await getServerSession(nextAuthOptions);
    const data = await getProductDetail(id, session?.accessToken);
    return {
      product: data,
    };
  } catch (error: any) {
    return { error: error.message ?? "Đã xảy ra lỗi" };
  }
};

async function Page({ params: { id } }: Props) {
  try {
    if (!isInteger(id)) {
      redirect(ProductRoute);
    }

    const session = await getServerSession(nextAuthOptions);
    const permissions = await getCurrentPermissions(session?.accessToken);

    if (!permissions.includes(ProductPermission.Access))
      return <AccessDeniedPage />;

    const { product, error } = await getProductDetailData(parseInt(id));

    if (error || !product) return <ErrorPage />;

    if (product.void) {
      return <RedirectToast content="Sản phẩm đã xóa" href={ProductRoute} />;
    }

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
  } catch (error) {
    return <ErrorPage />;
  }
}
export default Page;
