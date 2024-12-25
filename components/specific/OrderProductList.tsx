"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Image,
  Link,
  Tooltip,
  cn,
} from "@nextui-org/react";
import { GroupBox } from "../ui/GroupBox";
import { FormatOrderDetail, OrderStatus } from "@/app/api/order/order.type";
import NextImage from "next/image";
import { ImagePlaceholderPath } from "@/constants/filepath";
import { EditVariantRoute } from "@/constants/route";
import { CurrencyFormatter } from "@/libs/format-helper";
import { TbCirclePercentage, TbPackageExport } from "react-icons/tb";
import RenderIf from "../ui/RenderIf";
import OrderStatusCard from "../ui/OrderStatusCard";
import OrderCancelButton from "../ui/OrderCancelButton";
import OrderConfirmDelivery from "../ui/OrderConfirmDelivery";
import OrderPaymentReceiveButton from "../ui/OrderPaymentReceivedButton";
import OrderDeleteButton from "../ui/OrderDeleteButton";

type Props = {
  order: FormatOrderDetail;
};
const OrderProductList = ({ order }: Props) => {
  return (
    <GroupBox
      title="Sản phẩm"
      titleEndContent={<OrderStatusCard status={order.status} />}
    >
      <div className="max-w-full overflow-y-auto max-h-[300px]">
        <Table removeWrapper isHeaderSticky>
          <TableHeader>
            <TableColumn className="w-2/5">Sản phẩm</TableColumn>
            <TableColumn className="w-28" align="center">
              Số lượng
            </TableColumn>
            <TableColumn align="end">Đơn giá</TableColumn>
            <TableColumn align="end">Thành tiền</TableColumn>
          </TableHeader>
          <TableBody items={order.items}>
            {(item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <Image
                      as={NextImage}
                      alt=""
                      src={ImagePlaceholderPath}
                      width={40}
                      height={40}
                    />
                    <div className="flex flex-col gap-1">
                      <Link
                        href={EditVariantRoute(
                          item.product.id,
                          item.variant.id
                        )}
                      >
                        <span className="label-link line-clamp-1">
                          {item.product.name}
                        </span>
                      </Link>
                      <span className="line-clamp-1">
                        {item.variant.title === "Default Title"
                          ? "Mặc định"
                          : item.variant.title}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <span>{`${item.quantity}`}</span>
                    <Tooltip
                      showArrow
                      content={
                        <div className="flex flex-col text-xs">
                          <span className="font-semibold">Kho lấy hàng</span>
                          <div className="flex justify-between gap-1">
                            {item.sources.map((item) => (
                              <span key={item.id}>
                                {`${item.warehouse.name}:
                              ${item.quantity}`}
                              </span>
                            ))}
                          </div>
                        </div>
                      }
                    >
                      <div>
                        <TbPackageExport size={20} />
                      </div>
                    </Tooltip>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 justify-end">
                    <div className="flex gap-1 flex-col items-center">
                      <span
                        className={cn("line-through text-gray-500", {
                          hidden: item.discountAmount === 0,
                        })}
                      >
                        {CurrencyFormatter().format(item.priceBeforeDiscount)}
                      </span>
                      <span>
                        {CurrencyFormatter().format(item.priceAfterDiscount)}
                      </span>
                    </div>
                    {/* <RenderIf condition={item.discountAmount > 0}>
                      <div className="">
                        <TbCirclePercentage />
                      </div>
                    </RenderIf> */}
                  </div>
                </TableCell>
                <TableCell>
                  {CurrencyFormatter().format(item.totalPriceAfterDiscount)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex gap-4 justify-end my-2">
        <RenderIf
          condition={
            order.status !== OrderStatus.COMPLETE &&
            order.status !== OrderStatus.CANCEL
          }
        >
          <OrderCancelButton orderId={order.id} />
        </RenderIf>

        <RenderIf condition={order.status === OrderStatus.PENDING_PROCESSING}>
          <OrderConfirmDelivery orderId={order.id} />
        </RenderIf>

        <RenderIf condition={order.status === OrderStatus.IN_TRANSIT}>
          <OrderPaymentReceiveButton orderId={order.id} />
        </RenderIf>

        <RenderIf
          condition={
            order.status === OrderStatus.CANCEL ||
            order.status === OrderStatus.COMPLETE
          }
        >
          <OrderDeleteButton orderId={order.id} />
        </RenderIf>
      </div>
    </GroupBox>
  );
};
export default OrderProductList;
