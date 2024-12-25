import { getCurrentPermissions } from "@/app/api/customer";
import FormCreateProduct from "@/components/specific/forms/FormCreateProduct";
import AccessDeniedPage from "@/components/ui/AccessDeniedPage";
import Breadcrumbs, { BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import ErrorPage from "@/components/ui/ErrorPage";
import GoBackButton from "@/components/ui/GoBackButton";
import LoadingCard from "@/components/ui/LoadingCard";
import PageTitle from "@/components/ui/PageTitle";
import { ProductRoute } from "@/constants/route";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";
import { ProductPermission } from "@/libs/types/backend";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

const Page = async () => {
  try {
    const session = await getServerSession(nextAuthOptions);
    const permissions = await getCurrentPermissions(session?.accessToken);

    if (
      !permissions.includes(ProductPermission.Access) ||
      !permissions.includes(ProductPermission.Create)
    )
      return <AccessDeniedPage />;
    return (
      <div className="px-28">
        <div className="flex gap-4 items-center">
          <GoBackButton href={`${ProductRoute}`} />
          <PageTitle>Thêm sản phẩm</PageTitle>
        </div>
        <Suspense fallback={<LoadingCard />}>
          <FormCreateProduct />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.log(error);
    return <ErrorPage />;
  }
};

export default Page;
