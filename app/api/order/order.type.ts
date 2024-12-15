import { PaginitionData } from "@/libs/types/backend/response";

export enum OrderStatus {
  CANCEL = "Đã hủy",
  PENDING_PAYMENT = "Đang giao dịch",
  PENDING_PROCESSING = "Chờ xử lý giao hàng",
  IN_TRANSIT = "Đang vận chuyển",
  COMPLETE = "Đã hoàn thành",
}

export enum OrderTransactionStatus {
  PENDING_PAYMENT = "Chưa thanh toán",
  PAID = "Đã thanh toán",
}

export enum OrderHistoryType {
  PAYMENT = "Thanh toán",
  ADJUSTMENT = "Cập nhật",
  CREATED = "Khởi tạo",
}

export enum OrderHistoryAction {
  CREATE = "Khởi tạo",
  CONFIRM_SHIPPING = "Xác nhận giao hàng",
  CONFIRM_PAYMENT = "Xác nhận thanh toán",
}

export type OrderListCustomer = {
  id: string;
  name: string;
  email: string;
};

export type Order = {
  id: string;
  code: string;
  createdAt: string;
  total: number;
  transactionStatus: string;
  status: string;
  customer: null | OrderListCustomer;
  phoneNumber: string;
  name: string;
  customerId: string;
};

export type RequestOrderData = {
  data: Order[];
  paginition: PaginitionData;
};

export type FormatOrderDetail = {
  id: string;
  code: string;
  void: boolean;
  createdAt: string;
  totalItemBeforeDiscount: number;
  totalItemAfterDiscount: number;
  totalItemDiscountAmount: number;
  totalOrderDiscountAmount: number;
  totalOrderBeforeDiscount: number;
  totalOrderAfterDiscount: number;
  userType: string;
  status: string;
  transactionStatus: string;
  paymentMethod: string;
  email: string;
  name: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  note: string | null;
  receiverName: string;
  receiverPhoneNumber: string;
  items: Array<{
    id: number;
    quantity: number;
    priceBeforeDiscount: number;
    totalPriceBeforeDiscount: number;
    priceAfterDiscount: number;
    totalPriceAfterDiscount: number;
    discountAmount: number;
    totalDiscountAmount: number;
    product: {
      id: number;
      name: string;
      image: string;
    };
    variant: {
      id: number;
      title: string;
      image: string;
    };
    applyDiscounts: Array<{
      id: number;
      title: string;
      description: string;
      discountAmount: number;
    }>;
    sources: Array<{
      id: number;
      costPrice: number;
      quantity: number;
      receive: {
        id: number;
        code: string;
      } | null;
      warehouse: {
        id: number;
        name: string;
      };
    }>;
  }>;
  applyDiscounts: Array<{
    id: number;
    title: string;
    description: string;
    discountAmount: number;
  }>;
  histories: Array<{
    id: number;
    action: string;
    type: string;
    reason: string;
    changedEmployee: {
      id: number;
      name: string;
    };
    changedCustomer: {
      id: string;
      name: string;
    };
    createdAt: string;
  }>;
  customer: {
    id: string;
    name: string;
    email: string;
  };
};

export type ConfirmDeliveryDto = {
  orderId: string;
  isSendEmail: boolean;
};

export type ConfirmPaymentDto = {
  orderId: string;
};

export type CancelOrderDto = {
  orderId: string;
  isReStock: boolean;
  reason: string;
};
