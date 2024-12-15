import { FormatOrderDetail } from "@/app/api/order/order.type";
import { GroupBox } from "../ui/GroupBox";
import RenderIf from "../ui/RenderIf";
import { CurrencyFormatter } from "@/libs/format-helper";
import OrderTransactionStatusCard from "../ui/OrderTransactionStatusCard";

type Props = {
  order: FormatOrderDetail;
};
const OrderTransaction = ({ order }: Props) => {
  return (
    <GroupBox
      title="Thanh toán"
      titleEndContent={
        <OrderTransactionStatusCard status={order.transactionStatus} />
      }
    >
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <span className="flex-1">Sản phẩm</span>
          <div className="flex-[3] flex justify-between">
            <span>
              {order.items.reduce((total, item) => total + item.quantity, 0)}{" "}
              sản phẩm
            </span>
            <div className="flex gap-1">
              <RenderIf condition={order.totalItemDiscountAmount > 0}>
                <span className="line-through text-gray-500">
                  {CurrencyFormatter().format(order.totalItemBeforeDiscount)}
                </span>
              </RenderIf>
              <span>
                {CurrencyFormatter().format(order.totalItemAfterDiscount)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="flex-1">Giảm giá</span>
          <div className="flex-[3] flex justify-between">
            <span>Khuyến mại sản phẩm</span>
            <span>
              {CurrencyFormatter().format(order.totalItemDiscountAmount * -1)}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="flex-1"></span>
          <div className="flex-[3] flex justify-between">
            <span>Khuyến mại đơn hàng</span>
            <span>
              {CurrencyFormatter().format(order.totalOrderDiscountAmount * -1)}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center font-semibold">
          <span>Tổng tiền</span>
          <span>
            {CurrencyFormatter().format(order.totalOrderAfterDiscount)}
          </span>
        </div>
        <div className="flex justify-between items-center font-semibold">
          <span>Hình thức thanh toán</span>
          <span>{order.paymentMethod}</span>
        </div>
      </div>
    </GroupBox>
  );
};
export default OrderTransaction;
