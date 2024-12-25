import { getCurrentPermissions } from "@/app/api/customer";
import { GetDiscounts } from "@/app/api/discount";
import { DiscountTable } from "@/components/specific/tables/DiscountTable";
import AccessDeniedPage from "@/components/ui/AccessDeniedPage";
import CreateDiscountButton from "@/components/ui/CreateDiscountButton";
import ErrorPage from "@/components/ui/ErrorPage";
import PageTitle from "@/components/ui/PageTitle";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";
import { DiscountPermission, QueryParams } from "@/libs/types/backend";
import { getServerSession } from "next-auth";

type Props = {
  searchParams: QueryParams;
};

const getDiscountData = async (params: QueryParams) => {
  try {
    const session = await getServerSession(nextAuthOptions);
    const data = await GetDiscounts(params, session?.accessToken);

    return { data };
  } catch (error) {
    return { error };
  }
};

const Page = async ({ searchParams }: Props) => {
  try {
    const { data, error } = await getDiscountData(searchParams);
    const session = await getServerSession(nextAuthOptions);
    const permissions = await getCurrentPermissions(session?.accessToken);
    if (!permissions.includes(DiscountPermission.Access)) {
      return <AccessDeniedPage />;
    }
    if (error || !data) return <ErrorPage />;

    return (
      <div className="px-10 mb-5">
        <div className="flex justify-between flex-wrap items-center">
          <PageTitle>Danh sách khuyến mại</PageTitle>
          <CreateDiscountButton />
        </div>
        <DiscountTable
          count={data.paginition.count}
          discount={data.discounts}
          limit={data.paginition.limit}
          page={data.paginition.page}
          total={data.paginition.page}
        />
      </div>
    );
  } catch (error) {
    return <ErrorPage />;
  }
};

export default Page;
