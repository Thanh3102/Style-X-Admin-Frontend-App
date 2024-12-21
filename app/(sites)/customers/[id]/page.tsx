import { GetCustomerDetail } from "@/app/api/customer";
import ErrorPage from "@/components/ui/ErrorPage";
import GoBackButton from "@/components/ui/GoBackButton";
import { GroupBox } from "@/components/ui/GroupBox";
import OrderStatusCard from "@/components/ui/OrderStatusCard";
import OrderTransactionStatusCard from "@/components/ui/OrderTransactionStatusCard";
import PageTitle from "@/components/ui/PageTitle";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { convertDateToString } from "@/libs/helper";
import { CurrencyFormatter } from "@/libs/format-helper";
import { QueryParams } from "@/libs/types/backend";
import CustomerOrderSortSelect from "@/components/specific/filters/CustomerOrderSortSelect";

type Props = {
  params: { id: string };
  searchParams: QueryParams;
};
const Page = async ({ params: { id }, searchParams }: Props) => {
  try {
    const session = await getServerSession(nextAuthOptions);
    const customerDetail = await GetCustomerDetail(
      id,
      searchParams,
      session?.accessToken
    );

    return (
      <div className="px-20 py-5">
        <div className="flex items-center gap-5">
          <GoBackButton href="/customers" />
          <PageTitle>Thông tin khách hàng</PageTitle>
        </div>
        <div className="flex gap-5">
          <GroupBox title="Thông tin cá nhân" className="flex-1">
            <div className="flex flex-col gap-5">
              <div className="flex gap-5">
                <div className="flex flex-col gap-2">
                  <span>
                    Mã khách hàng: <strong>{customerDetail.code}</strong>
                  </span>
                  <span>
                    Họ tên: <strong>{customerDetail.name}</strong>
                  </span>
                  <span>
                    Giới tính: <strong>{customerDetail.gender}</strong>
                  </span>
                  <span>
                    Email: <strong>{customerDetail.email}</strong>
                  </span>
                </div>
              </div>
            </div>
          </GroupBox>
          <GroupBox
            title="Đơn hàng"
            className="flex-[2]"
            titleEndContent={<CustomerOrderSortSelect />}
          >
            <div className="flex flex-col max-h-[60vh] overflow-y-auto">
              {customerDetail.orders.map((order) => (
                <div
                  className="flex flex-col hover:bg-gray-100 py-3 px-1 rounded-sm"
                  key={order.id}
                >
                  <div className="flex justify-between">
                    <Link href={`/orders/${order.id}`}>
                      <span className="label-link font-medium">
                        {order.code}
                      </span>
                    </Link>
                    <div className="flex gap-2">
                      <OrderStatusCard status={order.status} />
                      <OrderTransactionStatusCard
                        status={order.transactionStatus}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col mt-1 text-sm gap-1">
                    <div className="flex justify-between items-center">
                      <span>Ngày tạo</span>
                      <span>{convertDateToString(order.createdAt)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Phương thức thanh toán</span>
                      <span>{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Giá trị đơn hàng</span>
                      <span>
                        {CurrencyFormatter().format(
                          order.totalItemAfterDiscount
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GroupBox>
        </div>
      </div>
    );
  } catch (error) {
    console.log(error);
    return <ErrorPage />;
  }
};
export default Page;
