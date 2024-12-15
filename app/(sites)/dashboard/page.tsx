import {
  GetBestSale,
  GetLowStock,
  GetReportOverview,
  GetReportRevenue,
} from "@/app/api/report";
import AverageOrderTotalLineChart from "@/components/specific/charts/AverageOrderTotalLineChart";
import OrderByTimeLineChart from "@/components/specific/charts/OrderByTimeLineChart";
import RevenueLineChart from "@/components/specific/charts/RevenueLineChart";
import { LowStockTable } from "@/components/specific/tables/LowStockTable";
import ErrorPage from "@/components/ui/ErrorPage";
import ReportDateRangePicker from "@/components/ui/ReportDateRangePicker";
import ReportOverviewInfo from "@/components/ui/ReportOverviewInfo";
import { CurrencyFormatter } from "@/libs/format-helper";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";
import { DateFilterOptionValue, QueryParams } from "@/libs/types/backend";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

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

    const ReportOverview = await GetReportOverview(
      params,
      session?.accessToken
    );

    const ReportRevenue = await GetReportRevenue(params, session?.accessToken);

    const ReportBestSale = await GetBestSale(params, session?.accessToken);

    const ReportLowStock = await GetLowStock(session?.accessToken);

    return (
      <div className="flex flex-col gap-4 px-10 py-5">
        <div className="">
          <ReportDateRangePicker />
        </div>
        <Suspense>
          <ReportOverviewInfo data={ReportOverview} />
        </Suspense>
        <div className="flex -mx-2 [&>*]:px-2 flex-wrap gap-y-4">
          <div className="w-1/2">
            <Suspense>
              <RevenueLineChart data={ReportRevenue} />
            </Suspense>
          </div>
          <div className="w-1/2">
            <Suspense>
              <AverageOrderTotalLineChart data={ReportRevenue} />
            </Suspense>
          </div>
          <div className="w-1/2">
            <div className="flex flex-col shadow-medium  bg-white rounded-md p-4 ">
              <div className="flex flex-col">
                <div className="h-[52px]">
                  <span>Top sản phẩm bán chạy</span>
                </div>
                <div className="h-[300px] mt-5 flex flex-col gap-2">
                  {ReportBestSale.map((item) => (
                    <div
                      className="flex justify-between gap-4 h-1/5"
                      key={item.productName}
                    >
                      <div className="flex-1 line-clamp-1 font-medium">
                        {item.productName}
                      </div>
                      <div className="flex-1 flex flex-col items-end">
                        <span className="font-semibold text-lg">
                          {CurrencyFormatter().format(item.revenue)}
                        </span>
                        <span className="text-zinc-400">
                          {item.quantity} sản phẩm
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/2">
            <Suspense>
              <OrderByTimeLineChart data={ReportRevenue} />
            </Suspense>
          </div>
          <div className="w-full">
            <div className="p-5 rounded-md bg-white">
              <LowStockTable data={ReportLowStock} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.log(error);
    return <ErrorPage />;
  }
};

export default Page;
