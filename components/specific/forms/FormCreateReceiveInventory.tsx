import { TagSeletor } from "@/components/common/TagSelector";
import { GroupBox } from "@/components/ui/GroupBox";
import { TagType } from "@/libs/types/backend";
import { Button } from "@nextui-org/react";
import ProductSelector from "../ProductSelector";


type Props = {};
const FormCreateReceiveInventory = (props: Props) => {
  return (
    <>
      <div className="flex gap-4 flex-wrap">
        <div className="flex flex-col flex-[4] gap-4 basis-[600px]">
          <GroupBox title="Sản phẩm">
            <ProductSelector />
          </GroupBox>
          <GroupBox title="Thanh toán"></GroupBox>
        </div>
        <div className="flex flex-col flex-[2] gap-4 basis-[300px]">
          <GroupBox title="Nhà cung cấp"></GroupBox>

          <GroupBox title="Kho nhập"></GroupBox>

          <GroupBox title="Thông tin bổ sung"></GroupBox>

          <GroupBox title="Ghi chú"></GroupBox>

          <TagSeletor type={TagType.RECEIVE_INVENTORY} />
        </div>
      </div>
    </>
  );
};
export default FormCreateReceiveInventory;
