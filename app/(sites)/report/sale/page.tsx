import { GetReportRevenueDetail } from "@/app/api/report";
import RevenueDetailChart from "@/components/specific/charts/RevenueDetailChart";
import RevenueLineChart from "@/components/specific/charts/RevenueLineChart";
import { RevenueDetailTable } from "@/components/specific/tables/RevenueDetailTable";
import ErrorPage from "@/components/ui/ErrorPage";
import GoBackButton from "@/components/ui/GoBackButton";
import PageTitle from "@/components/ui/PageTitle";
import ReportDateRangePicker from "@/components/ui/ReportDateRangePicker";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";
import { DateFilterOptionValue, QueryParams } from "@/libs/types/backend";
import { getServerSession } from "next-auth";

type Props = {
  searchParams: QueryParams;
};

const Page = async ({ searchParams }: Props) => {
  try {
    const session = await getServerSession(nextAuthOptions);
    const params = {
      ...searchParams,
      reportDate: searchParams.reportDate ?? DateFilterOptionValue.DAY_LAST_30,
    };

    const RevenueDetail = await GetReportRevenueDetail(
      params,
      session?.accessToken
    );

    return (
      <>
        <div className="px-5 flex gap-4 items-center">
          <GoBackButton href="/dashboard" />
          <PageTitle>Doanh thu theo thời gian</PageTitle>
        </div>
        <div className="p-5 flex flex-col gap-5">
          <div className="">
            <ReportDateRangePicker />
          </div>

          <RevenueDetailChart data={RevenueDetail.reports} />

          <div className="bg-white p-5 rounded-md shadow-medium">
            <RevenueDetailTable data={RevenueDetail} />
          </div>
        </div>
      </>
    );
  } catch (error) {
    return <ErrorPage />;
  }
};
export default Page;
