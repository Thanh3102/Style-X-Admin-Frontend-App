"use client";
import {
  ReportRevenue,
  ReportRevenueDetailResponse,
} from "@/app/api/report/report.type";
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
  data: ReportRevenueDetailResponse["reports"];
};

const RevenueDetailChart = ({ data }: Props) => {
  const formatYAxis = (value: any) => {
    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(0)} tỷ`;
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(0)} triệu`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(0)} nghìn`;
    }
    return value;
  };

  return (
    <div className="flex flex-col shadow-medium  bg-white rounded-md p-4 ">
      <div className="flex flex-col">
        <span className="font-semibold text-xl">Tổng doanh thu</span>
      </div>
      <div className="h-[300px] mt-5">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <Line
              type="bumpX"
              dataKey="goodValue"
              stroke={ChartLineColor}
              strokeWidth={3}
              name="Tổng doanh thu"
              dot={false}
            />
            <CartesianGrid
              // stroke="#ccc"
              // strokeDasharray="5 5"
              vertical={false}
            />
            <XAxis dataKey="label" />
            <YAxis
              domain={[0, (dataMax: number) => dataMax * 1.1]}
              tickCount={5}
              type="number"
              tickFormatter={formatYAxis}
              interval="preserveStartEnd"
            />
            <Tooltip
              wrapperClassName="rounded-lg"
              formatter={(value: number) => CurrencyFormatter().format(value)}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default RevenueDetailChart;
