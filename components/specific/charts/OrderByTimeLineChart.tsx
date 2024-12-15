"use client";
import { ReportRevenue } from "@/app/api/report/report.type";
import { CurrencyFormatter } from "@/libs/format-helper";
import { ChartLineColor } from "@/libs/rechart/color";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: ReportRevenue;
};

const OrderByTimeLineChart = ({ data }: Props) => {
  return (
    <div className="flex flex-col shadow-medium  bg-white rounded-md p-4 ">
      <div className="flex flex-col">
        <span>Số lượng đơn hàng theo thời gian</span>
        <span className="font-bold text-lg">{data.numberOfOrders}</span>
      </div>
      <div className="h-[300px] mt-5">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data.reports}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <Line
              type="bumpX"
              dataKey="count"
              stroke={ChartLineColor}
              strokeWidth={3}
              name="Số đơn hàng"
              dot={false}
            />
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" />
            <YAxis
              domain={[0, (dataMax: number) => Math.round(dataMax * 1.5)]}
              tickCount={5}
              type="number"
              interval="preserveStartEnd"
            />
            <Tooltip wrapperClassName="rounded-lg" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default OrderByTimeLineChart;
