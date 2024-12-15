import { OrderStatus } from "@/app/api/order/order.type";
import { Status } from "./Status";

type Props = {
  status: string;
};
const OrderStatusCard = ({ status }: Props) => {
  switch (status as OrderStatus) {
    case OrderStatus.PENDING_PROCESSING:
    case OrderStatus.PENDING_PAYMENT:
      return <Status color="warning" content={status} />;
    case OrderStatus.IN_TRANSIT:
      return <Status color="primary" content={status} />;
    case OrderStatus.CANCEL:
      return <Status color="danger" content={status} />;
    case OrderStatus.COMPLETE:
      return <Status color="default" content={status} />;
    default:
      return <></>;
  }
};
export default OrderStatusCard;
