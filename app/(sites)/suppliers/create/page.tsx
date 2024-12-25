import { getCurrentPermissions } from "@/app/api/customer";
import FormCreateSupplier from "@/components/specific/forms/FormCreateSupplier";
import AccessDeniedPage from "@/components/ui/AccessDeniedPage";
import ErrorPage from "@/components/ui/ErrorPage";
import GoBackButton from "@/components/ui/GoBackButton";
import LoadingCard from "@/components/ui/LoadingCard";
import PageTitle from "@/components/ui/PageTitle";
import { SuppliersRoute } from "@/constants/route";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";
import { SupplierPermission } from "@/libs/types/backend";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

const Page = async () => {
  try {
    const session = await getServerSession(nextAuthOptions);
    const permissions = await getCurrentPermissions(session?.accessToken);
    if (!permissions.includes(SupplierPermission.Create)) {
      return <AccessDeniedPage />;
    }
    return (
      <div className="px-32">
        <div className="flex gap-4 items-center">
          <GoBackButton href={SuppliersRoute} />
          <PageTitle>Thêm mới nhà cung cấp</PageTitle>
        </div>
        <Suspense fallback={<LoadingCard />}>
          <FormCreateSupplier />
        </Suspense>
      </div>
    );
  } catch (error) {
    return <ErrorPage />;
  }
};

export default Page;
