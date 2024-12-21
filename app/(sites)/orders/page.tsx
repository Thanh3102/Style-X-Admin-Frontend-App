import { GetOrderList } from "@/app/api/order";
import { OrderTable } from "@/components/specific/tables/OrderTable";
import ErrorPage from "@/components/ui/ErrorPage";
import LoadingCard from "@/components/ui/LoadingCard";
import PageTitle from "@/components/ui/PageTitle";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";
import { QueryParams } from "@/libs/types/backend";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

type Props = {
  searchParams: QueryParams;
};

const Page = async ({ searchParams }: Props) => {
  try {
    const session = await getServerSession(nextAuthOptions);
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
