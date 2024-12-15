import { ReportOverview } from "@/app/api/report/report.type";
import { CurrencyFormatter } from "@/libs/format-helper";

type Props = {
  data: ReportOverview;
};
const ReportOverviewInfo = ({ data }: Props) => {
  return (
    <div className="flex -mx-2 [&>*]:px-2 flex-wrap">
      <div className="flex flex-col w-1/4">
        <div className="bg-white rounded-lg p-3 shadow-medium  flex-col flex">
          <span>Doanh thu thuần</span>
          <span className="font-bold text-xl">
            {CurrencyFormatter().format(data.grossProfit)}
          </span>
        </div>
      </div>

      <div className="flex flex-col w-1/4">
        <div className="bg-white rounded-lg p-3 shadow-medium flex-col flex">
          <span>Lợi nhuận gộp</span>
          <span className="font-bold text-xl">
            {CurrencyFormatter().format(data.netRevenue)}
          </span>
        </div>
      </div>

      <div className="flex flex-col w-1/4">
        <div className="bg-white rounded-lg p-3 shadow-medium flex-col flex">
          <span>Đơn hàng</span>
          <span className="font-bold text-xl">{data.numberOfOrders}</span>
        </div>
      </div>

      <div className="flex flex-col w-1/4">
        <div className="bg-white rounded-lg p-3 shadow-medium flex-col flex">
          <span>Giá trị tồn kho</span>
          <span className="font-bold text-xl">
            {CurrencyFormatter().format(data.inventoryValue)}
          </span>
        </div>
      </div>
    </div>
  );
};
export default ReportOverviewInfo;
