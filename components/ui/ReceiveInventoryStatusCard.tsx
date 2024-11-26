import { ReceiveInventoryStatus } from "@/libs/types/backend";

type Props = {
  status: string;
};
const ReceiveInventoryStatusCard = (props: Props) => {
  switch (props.status) {
    case ReceiveInventoryStatus.CANCEL:
      return (
        <div className="px-3 py-1 text-center rounded-full bg-red-100 text-red-500 border-1 border-red-500 text-xs">
          {ReceiveInventoryStatus.CANCEL}
        </div>
      );
    case ReceiveInventoryStatus.NOT_RECEIVED:
      return (
        <div className="px-3 py-1 text-center rounded-full bg-yellow-100 text-yellow-500 border-1 border-yellow-500 text-xs">
          {ReceiveInventoryStatus.NOT_RECEIVED}
        </div>
      );
    case ReceiveInventoryStatus.PARTIALLY_RECEIVED:
      return (
        <div className="px-3 py-1 text-center rounded-full bg-blue-100 text-blue-500 border-1 border-blue-500 text-xs">
          {ReceiveInventoryStatus.PARTIALLY_RECEIVED}
        </div>
      );
    case ReceiveInventoryStatus.RECEIVED:
      return (
        <div className="px-3 py-1 text-center rounded-full bg-gray-100 text-gray-500 border-1 border-gray-500 text-xs">
          {ReceiveInventoryStatus.RECEIVED}
        </div>
      );
    default:
      return <></>;
  }
};
export default ReceiveInventoryStatusCard;
