import Link from "next/link";
import { GroupBox } from "../ui/GroupBox";
import { cn } from "@/libs/utils";
import { CurrencyFormatter } from "@/libs/format-helper";
import {
  DetailSuppler,
  ReceiveInventoryTransaction,
} from "@/libs/types/backend";
import { ReceiveInventoryDetailRoute } from "@/constants/route";
import ReceiveInventoryStatusCard from "../ui/ReceiveInventoryStatusCard";
import ReceiveTransactionStatusCard from "../ui/ReceiveTransactionStatusCard";
import { convertDateToString } from "@/libs/helper";
import RenderIf from "../ui/RenderIf";

export type SupplierOrdersPanelProps = {
  supplier: DetailSuppler;
};

const SupplierOrdersPanel = ({ supplier }: SupplierOrdersPanelProps) => {
  const unPaidReceives = supplier.receives.filter(
    (item) =>
      item.transactionStatus === ReceiveInventoryTransaction.UN_PAID ||
      item.transactionStatus === ReceiveInventoryTransaction.PARTIALLY_PAID
  );
  return (
    <div className="flex flex-col gap-5">
      <GroupBox title={`Mã nhà cung cấp: ${supplier.code}`}>
        <div className="flex -mx-3 w-full text-stone-500 font-medium text-sm">
          <div className="col-3 px-3 flex flex-col flex-1">
            <p>Đơn nhập</p>
            <p>đã tạo</p>
            <p
              className={cn(" text-blue-600")}
            >{`${supplier.receives.length} đơn`}</p>
            <p>
              {CurrencyFormatter().format(
                supplier.receives.reduce(
                  (total, item) => total + item.totalReceipt,
                  0
                )
              )}
            </p>
          </div>
          <div className="col-3 px-3 flex flex-col flex-1">
            <p>Đơn đã nhập</p>
            <p>chưa thanh toán</p>
            <p
              className={cn(" text-blue-600")}
            >{`${unPaidReceives.length} đơn`}</p>
            <p>
              {CurrencyFormatter().format(
                unPaidReceives.reduce(
                  (total, item) => total + item.totalReceipt,
                  0
                )
              )}
            </p>
          </div>
        </div>
      </GroupBox>

      <GroupBox title="Lịch sử nhập hàng">
        <div className="flex flex-col max-h-[500px] overflow-y-auto">
          {supplier.receives.map((receive) => (
            <div
              key={receive.id}
              className="justify-between flex py-3 border-t-1 border-zinc-400"
            >
              <div className="flex flex-col">
                <span className="font-medium">
                  Mã đơn nhập:{" "}
                  <Link
                    href={ReceiveInventoryDetailRoute(receive.id)}
                    className="label-link"
                  >
                    {receive.code}
                  </Link>
                </span>
                <span>Ngày tạo: {convertDateToString(receive.createdAt)}</span>
                <RenderIf condition={receive.transactionRemainAmount > 0}>
                  <span className="">
                    Số tiền chưa thanh toán:{" "}
                    <span className="font-medium text-red-500">
                      {CurrencyFormatter().format(
                        receive.transactionRemainAmount
                      )}
                    </span>
                  </span>
                </RenderIf>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <div className="flex gap-2">
                  <ReceiveInventoryStatusCard status={receive.status} />
                  <ReceiveTransactionStatusCard
                    status={receive.transactionStatus}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {CurrencyFormatter().format(receive.totalReceipt)}
                  </span>
                  <span className="text-zinc-400 text-sm">
                    ({receive.totalItems} sản phẩm)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GroupBox>
    </div>
  );
};

export { SupplierOrdersPanel };
