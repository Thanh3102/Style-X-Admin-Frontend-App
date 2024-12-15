import { OrderTransactionStatus } from "@/app/api/order/order.type";
import { Status } from "./Status";

type Props = {
  status: string;
};
const OrderTransactionStatusCard = ({ status }: Props) => {
  switch (status as OrderTransactionStatus) {
    case OrderTransactionStatus.PENDING_PAYMENT:
      return <Status color="warning" content={status} />;
    case OrderTransactionStatus.PAID:
      return <Status color="default" content={status} />;
    default:
      return <></>;
  }
};
export default OrderTransactionStatusCard;
