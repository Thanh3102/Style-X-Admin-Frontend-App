import { getCurrentPermissions } from "@/app/api/customer";
import { getReceiveInventoryDetail } from "@/app/api/receive-inventory";
import FormEditReceiveInventory from "@/components/specific/forms/FormEditReceiveInventory";
import AccessDeniedPage from "@/components/ui/AccessDeniedPage";
import ErrorPage from "@/components/ui/ErrorPage";
import GoBackButton from "@/components/ui/GoBackButton";
import PageTitle from "@/components/ui/PageTitle";
import ReceiveInventoryStatusCard from "@/components/ui/ReceiveInventoryStatusCard";
import ReceiveTransactionStatusCard from "@/components/ui/ReceiveTransactionStatusCard";
import RedirectToast from "@/components/ui/RedirectToast";
import RenderIf from "@/components/ui/RenderIf";
import { ReceiveInventoryRoute } from "@/constants/route";
import { convertDateToString } from "@/libs/helper";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";
import {
  ReceiveInventoryPermission,
  ReceiveInventoryStatus,
} from "@/libs/types/backend";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

const getDetailData = async (id: string | number) => {
  try {
    const session = await getServerSession(nextAuthOptions);
    const data = await getReceiveInventoryDetail(id, session?.accessToken);
    return { data };
  } catch (error) {
    return { error };
  }
};

const Page = async (props: Props) => {
  try {
    const session = await getServerSession(nextAuthOptions);
    const permissions = await getCurrentPermissions(session?.accessToken);
    if (!permissions.includes(ReceiveInventoryPermission.Access)) {
      return <AccessDeniedPage />;
    }
    const { id } = props.params;
    const { data, error } = await getDetailData(id);

    if (error || !data) return <ErrorPage />;

    if (data.void) {
      return (
        <RedirectToast
          href={ReceiveInventoryRoute}
          type="error"
          content="Đơn nhập đã xóa"
        />
      );
    }

    return (
      <div className="px-28 mb-5">
        <div className="flex gap-4 items-center">
          <GoBackButton href={`${ReceiveInventoryRoute}`} />
          <PageTitle>{data.code}</PageTitle>
          <span className="text-gray-500 text-sm">
            {convertDateToString(data.createdAt)}
          </span>
          <ReceiveInventoryStatusCard status={data.status} />
          <RenderIf condition={data.status !== ReceiveInventoryStatus.CANCEL}>
            <ReceiveTransactionStatusCard status={data.transactionStatus} />
          </RenderIf>
        </div>

        <FormEditReceiveInventory receiveInventory={data} />
      </div>
    );
  } catch (error) {
    return <ErrorPage />;
  }
};
export default Page;
