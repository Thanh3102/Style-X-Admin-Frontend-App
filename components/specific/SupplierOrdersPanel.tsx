import Link from "next/link";
import { GroupBox } from "../ui/GroupBox";
import { cn } from "@/libs/utils";
import { CurrencyFormatter } from "@/libs/format-helper";
import { DetailSuppler } from "@/libs/types/backend";

export type SupplierOrdersPanelProps = {
  supplier: DetailSuppler;
};

const SupplierOrdersPanel = ({ supplier }: SupplierOrdersPanelProps) => {
  return (
    <div className="flex flex-col gap-5">
      <GroupBox title={`Mã nhà cung cấp: ${supplier.code}`}>
        <div className="flex -mx-3 w-full text-stone-500 font-medium text-sm">
          <div className="col-3 px-3 flex flex-col">
            <p>Đơn nhập</p>
            <p>đã tạo</p>
            <Link
              href={"#"}
              className={cn("label-link text-blue-600")}
            >{`${0} đơn`}</Link>
            <p>{CurrencyFormatter().format(999999999)}</p>
          </div>
          <div className="col-3 px-3 flex flex-col">
            <p>Đơn đã nhập</p>
            <p>chưa thanh toán</p>
            <Link
              href={"#"}
              className={cn("label-link text-blue-600")}
            >{`${0} đơn`}</Link>
            <p>{CurrencyFormatter().format(99999)}</p>
          </div>
          <div className="col-3 px-3 flex flex-col">
            <p>Đơn trả</p>
            <p>đã tạo</p>
            <Link
              href={"#"}
              className={cn("label-link text-red-600")}
            >{`${0} đơn`}</Link>
            <p>{CurrencyFormatter().format(99999)}</p>
          </div>
          <div className="col-3 px-3 flex flex-col">
            <p>Đơn trả</p>
            <p>chưa nhận hoàn tiền</p>
            <Link
              href={"#"}
              className={cn("label-link text-red-600")}
            >{`${0} đơn`}</Link>
            <p>{CurrencyFormatter().format(99999)}</p>
          </div>
        </div>
      </GroupBox>

      <GroupBox title="Lịch sử nhập/trả hàng">Placeholder</GroupBox>
    </div>
  );
};

export { SupplierOrdersPanel };
