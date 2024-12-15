import { FormatOrderDetail } from "@/app/api/order/order.type";
import { Avatar, cn, Link, Textarea } from "@nextui-org/react";
import { GroupBox } from "../ui/GroupBox";
import RenderIf from "../ui/RenderIf";

type Props = {
  order: FormatOrderDetail;
  className?: string;
};
const OrderInfo = ({ order, className }: Props) => {
  return (
    <>
      <GroupBox title="Thông tin khách hàng">
        <div className={cn("bg-gray-100 p-4 rounded-md max-w-full", className)}>
          <div className="flex gap-2 item s-center">
            <Avatar showFallback />
            <RenderIf condition={order.userType === "Customer"}>
              <Link href={`/customers/${order?.customer?.id}`}>
                <span className="label-link">{order.name}</span>
              </Link>
            </RenderIf>
            <RenderIf condition={order.userType === "Guest"}>
              <span>{`${order.name}`}</span>
            </RenderIf>
          </div>
          <div className="flex flex-col gap-1 text-sm text-gray-500 mt-4">
            <span className="line-clamp-1">
              Số điện thoại: {order.phoneNumber}
            </span>
            <span className="line-clamp-1">Email: {order.email}</span>
          </div>
        </div>
      </GroupBox>

      <GroupBox title="Địa chỉ nhận hàng">
        <div className="flex flex-col gap-1 text-sm">
          <span className="">{`${order.address}, ${order.ward}, ${order.district}, ${order.province}`}</span>
          <span>
            Người nhận: {order.receiverName ? order.receiverName : "---"}
          </span>
          <span>
            SĐT người nhận:{" "}
            {order.receiverPhoneNumber ? order.receiverPhoneNumber : "---"}
          </span>
        </div>
      </GroupBox>

      <GroupBox title="Ghi chú">
        <Textarea
          isReadOnly
          isDisabled
          maxRows={5}
          minRows={5}
          defaultValue={order.note ?? "Không có ghi chú"}
          variant="bordered"
          radius="sm"
        />
      </GroupBox>
    </>
  );
};
export default OrderInfo;
