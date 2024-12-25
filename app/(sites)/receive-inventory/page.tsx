import { getCurrentPermissions } from "@/app/api/customer";
import { getReceiveInventory } from "@/app/api/receive-inventory";
import { ReceiveInventoryTable } from "@/components/specific/tables/ReceiveInventoryTable";
import AccessDeniedPage from "@/components/ui/AccessDeniedPage";
import ErrorPage from "@/components/ui/ErrorPage";
import LinkButton from "@/components/ui/LinkButton";
import LoadingCard from "@/components/ui/LoadingCard";
import PageTitle from "@/components/ui/PageTitle";
import { CreateReceiveInventoryRoute } from "@/constants/route";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";
import { QueryParams, ReceiveInventoryPermission } from "@/libs/types/backend";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import { FaPlus } from "react-icons/fa6";

type Props = {
  params: { slug: string };
  searchParams: QueryParams;
};

const getReceiveInventoryData = async (queryParams: QueryParams) => {
  try {
    const session = await getServerSession(nextAuthOptions);
    const data = await getReceiveInventory(queryParams, session?.accessToken);

    return { data };
  } catch (error) {
    return { error };
  }
};

const Page = async (props: Props) => {
  try {
    const { data, error } = await getReceiveInventoryData(props.searchParams);

    if (error || !data) return <ErrorPage />;

    const session = await getServerSession(nextAuthOptions);
    const permissions = await getCurrentPermissions(session?.accessToken);
    if (!permissions.includes(ReceiveInventoryPermission.Access)) {
      return <AccessDeniedPage />;
    }

    return (
      <div className="px-14 mb-5">
        <div className="flex justify-between items-center">
          <PageTitle>Danh sách đơn nhập hàng </PageTitle>
          <LinkButton
            href={`${CreateReceiveInventoryRoute}`}
            buttonProps={{ startContent: <FaPlus size={18} /> }}
          >
            Tạo đơn nhập hàng
          </LinkButton>
        </div>
        <Suspense fallback={<LoadingCard />}>
          <ReceiveInventoryTable
            receives={data.receiveInventory}
            total={data.paginition.total}
            count={data.paginition.count}
            page={data.paginition.page}
            limit={data.paginition.limit}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.log(error);
    return <ErrorPage />;
  }
};
export default Page;
