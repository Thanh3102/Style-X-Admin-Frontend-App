import { getCurrentPermissions } from "@/app/api/customer";
import FormCreateReceiveInventory from "@/components/specific/forms/FormCreateReceiveInventory";
import AccessDeniedPage from "@/components/ui/AccessDeniedPage";
import ErrorPage from "@/components/ui/ErrorPage";
import GoBackButton from "@/components/ui/GoBackButton";
import PageTitle from "@/components/ui/PageTitle";
import { ReceiveInventoryRoute } from "@/constants/route";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";
import { ReceiveInventoryPermission } from "@/libs/types/backend";
import { getServerSession } from "next-auth";

const Page = async () => {
  try {
    const session = await getServerSession(nextAuthOptions);
    const permissions = await getCurrentPermissions(session?.accessToken);
    if (!permissions.includes(ReceiveInventoryPermission.Create)) {
      return <AccessDeniedPage />;
    }
    return (
      <div className="px-28 mb-5">
        <div className="flex gap-4 items-center">
          <GoBackButton href={`${ReceiveInventoryRoute}`} />
          <PageTitle>Tạo đơn nhập hàng </PageTitle>
        </div>

        <FormCreateReceiveInventory />
      </div>
    );
  } catch (error) {
    return <ErrorPage />;
  }
};
export default Page;
