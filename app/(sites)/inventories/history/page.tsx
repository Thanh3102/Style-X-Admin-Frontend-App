import { getInventoriesHistory } from "@/app/api/inventories";
import { auth } from "@/auth";
import { InventoryHistoryTable } from "@/components/specific/InventoryHistoryTable";
import ErrorPage from "@/components/ui/ErrorPage";
import LoadingCard from "@/components/ui/LoadingCard";
import PageTitle from "@/components/ui/PageTitle";
import { QueryParams } from "@/libs/types/backend";
import { Suspense } from "react";

const getInventoriesHistoryData = async (params: QueryParams) => {
  try {
    const session = await auth();
    const data = await getInventoriesHistory(session?.accessToken, params);
    return {
      inventoryHistory: data.inventoryHistory,
      paginition: data.paginition,
    };
  } catch (error) {
    return { error };
  }
};

type Props = {
  searchParams: Promise<QueryParams>;
};

const Page = async ({ searchParams: searchParamsPromise }: Props) => {
  const searchParams = await searchParamsPromise;
  const { inventoryHistory, paginition, error } =
    await getInventoriesHistoryData(searchParams);

  if (error || !inventoryHistory || !paginition) return <ErrorPage />;

  return (
    <>
      <div className="px-16 mb-5">
        <div className="flex gap-4 items-center">
          {/* <GoBackButton href={`${ProductRoute}`} /> */}
          <PageTitle>{`Lịch sử tồn kho`}</PageTitle>
        </div>
        <Suspense fallback={<LoadingCard />}>
          <InventoryHistoryTable
            inventoryHistory={inventoryHistory}
            count={paginition.count}
            limit={paginition.limit}
            page={paginition.page}
            total={paginition.total}
          />
        </Suspense>
      </div>
    </>
  );
};
export default Page;
