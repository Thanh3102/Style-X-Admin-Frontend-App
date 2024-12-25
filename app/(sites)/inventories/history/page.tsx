import { getInventoriesHistory } from "@/app/api/inventories";
import { getVariantDetail } from "@/app/api/products";
import { InventoryHistoryTable } from "@/components/specific/InventoryHistoryTable";
import ErrorPage from "@/components/ui/ErrorPage";
import GoBackButton from "@/components/ui/GoBackButton";
import LoadingCard from "@/components/ui/LoadingCard";
import PageTitle from "@/components/ui/PageTitle";
import { ProductRoute } from "@/constants/route";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";
import { QueryParams } from "@/libs/types/backend";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

// const getVariantData = async (variantId: string | number) => {
//   try {
//     const session = await getServerSession(nextAuthOptions);
//     const data = await getVariantDetail(variantId, session?.accessToken);
//     return { variant: data };
//   } catch (error) {
//     return { variant: null, error };
//   }
// };

const getInventoriesHistoryData = async (params: QueryParams) => {
  try {
    const session = await getServerSession(nextAuthOptions);
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
  searchParams: QueryParams;
};

const Page = async ({ searchParams }: Props) => {
  // const { variant, error: getVariantDataError } = await getVariantData(
  //   props.searchParams.variantIds ?? ""
  // );
  const {
    inventoryHistory,
    paginition,
    error: getInventoriesHistoryDataError,
  } = await getInventoriesHistoryData(searchParams);

  if (getInventoriesHistoryDataError || !inventoryHistory || !paginition)
    return <ErrorPage />;

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
