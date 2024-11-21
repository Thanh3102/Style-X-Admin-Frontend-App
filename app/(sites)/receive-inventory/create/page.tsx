import FormCreateReceiveInventory from "@/components/specific/forms/FormCreateReceiveInventory";
import GoBackButton from "@/components/ui/GoBackButton";
import { GroupBox } from "@/components/ui/GroupBox";
import PageTitle from "@/components/ui/PageTitle";
import { ReceiveInventoryRoute } from "@/constants/route";

type Props = {};
const Page = (props: Props) => {
  return (
    <div className="px-28 mb-5">
      <div className="flex gap-4 items-center">
        <GoBackButton href={`${ReceiveInventoryRoute}`} />
        <PageTitle>Tạo đơn nhập hàng </PageTitle>
      </div>

      <FormCreateReceiveInventory />
    </div>
  );
};
export default Page;
