import { getCurrentPermissions } from "@/app/api/customer";
import { GetWarehouseDetail } from "@/app/api/warehouses";
import { WarehouseInventoryTable } from "@/components/specific/tables/WarehouseInventoryTable";
import AccessDeniedPage from "@/components/ui/AccessDeniedPage";
import ErrorPage from "@/components/ui/ErrorPage";
import GoBackButton from "@/components/ui/GoBackButton";
import LoadingCard from "@/components/ui/LoadingCard";
import PageTitle from "@/components/ui/PageTitle";
import { WarehouseRoute } from "@/constants/route";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";
import { QueryParams, WarehousePermission } from "@/libs/types/backend";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

type Props = {
  params: { id: string };
  searchParams: QueryParams;
};
const Page = async ({ searchParams, params }: Props) => {
  try {
    const session = await getServerSession(nextAuthOptions);
    const permissions = await getCurrentPermissions(session?.accessToken);
    if (!permissions.includes(WarehousePermission.Access)) {
      return <AccessDeniedPage />;
    }
    const warehouseDetail = await GetWarehouseDetail(
      parseInt(params.id),
      session?.accessToken,
      searchParams
    );

    return (
      <>
        <div className="px-16 mb-5">
          <div className="flex gap-4 items-center">
            <GoBackButton href={`${WarehouseRoute}`} />
            <PageTitle>{warehouseDetail?.name}</PageTitle>
          </div>
          <Suspense fallback={<LoadingCard />}>
            <WarehouseInventoryTable warehouseDetail={warehouseDetail} />
          </Suspense>
        </div>
      </>
    );
  } catch (error) {
    console.log(error);
    return <ErrorPage />;
  }
};
export default Page;
