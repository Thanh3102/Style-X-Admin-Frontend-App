import { ReceiveInventoryTransaction } from "@/libs/types/backend";

type Props = {
  status: string;
};
const ReceiveTransactionStatusCard = (props: Props) => {
  switch (props.status) {
    case ReceiveInventoryTransaction.UN_PAID:
      return (
        <div className="px-3 py-1 rounded-full text-center bg-yellow-100 text-yellow-500 border-1 border-yellow-500 text-xs">
          {ReceiveInventoryTransaction.UN_PAID}
        </div>
      );
    case ReceiveInventoryTransaction.PARTIALLY_PAID:
      return (
        <div className="px-3 py-1 rounded-full text-center bg-blue-100 text-blue-500 border-1 border-blue-500 text-xs">
          {ReceiveInventoryTransaction.PARTIALLY_PAID}
        </div>
      );
    case ReceiveInventoryTransaction.PAID:
      return (
        <div className="px-3 py-1 rounded-full text-center bg-gray-100 text-gray-500 border-1 border-gray-500 text-xs">
          {ReceiveInventoryTransaction.PAID}
        </div>
      );
    default:
      return <></>;
  }
};
export default ReceiveTransactionStatusCard;
