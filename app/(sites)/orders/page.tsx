import { getCurrentPermissions } from "@/app/api/customer";
import { GetOrderList } from "@/app/api/order";
import { auth } from "@/auth";
import { OrderTable } from "@/components/specific/tables/OrderTable";
import AccessDeniedPage from "@/components/ui/AccessDeniedPage";
import ErrorPage from "@/components/ui/ErrorPage";
import LoadingCard from "@/components/ui/LoadingCard";
import PageTitle from "@/components/ui/PageTitle";

import { OrderPermission, QueryParams } from "@/libs/types/backend";

import { Suspense } from "react";

type Props = {
  searchParams: QueryParams;
};

const Page = async ({ searchParams }: Props) => {
  try {
    const session = await auth();
    const permissions = await getCurrentPermissions(session?.accessToken);
    if (!permissions.includes(OrderPermission.Access))
      return <AccessDeniedPage />;

    const { data, paginition } = await GetOrderList(
      searchParams,
      session?.accessToken
    );
    
    return (
      <div className="px-14 mb-5">
        <div className="flex justify-between items-center">
          <PageTitle>Danh sách đơn hàng </PageTitle>
        </div>
        <Suspense fallback={<LoadingCard />}>
          <OrderTable
            orders={data}
            total={paginition.total}
            count={paginition.count}
            page={paginition.page}
            limit={paginition.limit}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    return <ErrorPage />;
  }
};

export default Page;
