import { GetCustomer } from "@/app/api/customer";
import CustomerTable from "@/components/specific/tables/CustomerTable";
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
    const data = await GetCustomer(searchParams, session?.accessToken);
    return (
      <div className="px-5">
        <div className="flex justify-between items-center">
          <PageTitle>Danh sách khách hàng</PageTitle>
        </div>
        <Suspense fallback={<LoadingCard />}>
          <CustomerTable
            customers={data.customers}
            paginition={data.paginition}
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
