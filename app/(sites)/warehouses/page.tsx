import { getCurrentPermissions } from "@/app/api/customer";
import { getWarehouse } from "@/app/api/warehouses";
import { WarehouseTable } from "@/components/specific/tables/WarehousesTable";
import AccessDeniedPage from "@/components/ui/AccessDeniedPage";
import CreateWarehouseButton from "@/components/ui/CreateWarehouseButton";
import ErrorPage from "@/components/ui/ErrorPage";
import LoadingCard from "@/components/ui/LoadingCard";
import PageTitle from "@/components/ui/PageTitle";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";
import { QueryParams, WarehousePermission } from "@/libs/types/backend";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

type Props = {
  searchParams: QueryParams;
};
const Page = async ({ searchParams }: Props) => {
  try {
    const session = await getServerSession(nextAuthOptions);
    const permissions = await getCurrentPermissions(session?.accessToken);
    if (!permissions.includes(WarehousePermission.Access)) {
      return <AccessDeniedPage />;
    }

    const warehouses = await getWarehouse(session?.accessToken, searchParams);
    return (
      <div className="px-14 mb-5">
        <div className="flex justify-between items-center">
          <PageTitle>Danh sách kho hàng </PageTitle>
          <CreateWarehouseButton/>
        </div>
        <Suspense fallback={<LoadingCard />}>
          <WarehouseTable warehouses={warehouses} />
        </Suspense>
      </div>
    );
  } catch (error) {
    return <ErrorPage />;
  }
};
export default Page;
