import { getCurrentPermissions } from "@/app/api/customer";
import { GetOrderDetail } from "@/app/api/order";
import { OrderStatus } from "@/app/api/order/order.type";
import OrderHistory from "@/components/specific/OrderHistory";
import OrderInfo from "@/components/specific/OrderInfo";
import OrderProductList from "@/components/specific/OrderProductList";
import OrderTransaction from "@/components/specific/OrderTransaction";
import AccessDeniedPage from "@/components/ui/AccessDeniedPage";
import ErrorPage from "@/components/ui/ErrorPage";
import GoBackButton from "@/components/ui/GoBackButton";
import OrderStatusCard from "@/components/ui/OrderStatusCard";
import OrderTransactionStatusCard from "@/components/ui/OrderTransactionStatusCard";
import PageTitle from "@/components/ui/PageTitle";
import RedirectToast from "@/components/ui/RedirectToast";
import RenderIf from "@/components/ui/RenderIf";
import { OrdersRoute } from "@/constants/route";
import { convertDateToString } from "@/libs/helper";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";
import { OrderPermission } from "@/libs/types/backend";
import { getServerSession } from "next-auth";

type Props = {
  params: { id: string };
};
const Page = async ({ params: { id } }: Props) => {
  try {
    const session = await getServerSession(nextAuthOptions);
    const orderDetail = await GetOrderDetail(id, session?.accessToken);
    const permissions = await getCurrentPermissions(session?.accessToken);
    if (!permissions.includes(OrderPermission.Access))
      return <AccessDeniedPage />;
    
    if (orderDetail.void) {
      return (
        <RedirectToast
          href={OrdersRoute}
          content="Đơn hàng đã xóa"
          type="error"
        />
      );
    }

    return (
      <div className="px-28 mb-5">
        <div className="flex gap-4 items-center">
          <GoBackButton href={`${OrdersRoute}`} />
          <PageTitle>{orderDetail.code}</PageTitle>
          <span className="text-gray-500 text-sm">
            {convertDateToString(orderDetail.createdAt)}
          </span>
          <OrderStatusCard status={orderDetail.status} />
          <RenderIf condition={orderDetail.status !== OrderStatus.CANCEL}>
            <OrderTransactionStatusCard
              status={orderDetail.transactionStatus}
            />
          </RenderIf>
        </div>
        <div className="flex gap-4">
          <div className="flex-[2] flex flex-col gap-4">
            <OrderProductList order={orderDetail} />
            <OrderTransaction order={orderDetail} />
            <OrderHistory histories={orderDetail.histories} />
          </div>
          <div className="flex-[1] flex flex-col gap-4">
            <OrderInfo order={orderDetail} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return <ErrorPage />;
  }
};
export default Page;
