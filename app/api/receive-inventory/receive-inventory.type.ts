import { PaginitionData } from "../suppliers/suppliers.type";

export type ReceiveInventoryDetail = {
  id: number;
  code: string;
  expectedAt: Date | null;
  status: string;
  transactionStatus: string;
  note: string | null;
  totalItems: number;
  totalItemsDiscount: number;
  totalItemsPrice: number;
  totalLandedCost: number;
  totalReceipt: number;
  totalItemsPriceBeforeDiscount: number;
  transactionRemainAmount: number;
  void: boolean;
  createdAt: Date;
  receiveHistories: Array<{
    id: number;
    action: string;
    type: string;
    createdAt: Date;
    changedUser: {
      name: string;
    };
    receiveTransaction: {
      id: number;
      paymentMethod: string;
      amount: number;
      createdAt: Date;
      processedAt: Date;
    } | null;
  }>;
  receiveLandedCosts: Array<{
    id: number;
    name: string;
    price: number;
  }>;
  items: Array<{
    id: number;
    discountAmount: number;
    discountTotal: number;
    discountType: string;
    discountValue: number;
    finalPrice: number;
    finalTotal: number;
    price: number;
    quantity: number;
    quantityAvaiable: number;
    quantityReceived: number;
    quantityRemain: number;
    variant: {
      id: number;
      title: string;
      image: string | null;
      product: {
        id: number;
        name: string;
        image: string | null;
      };
    };
  }>;
  warehouse: {
    id: number;
    name: string;
  };
  tags: string[];
  supplier: {
    id: number;
    name: string;
    code: string;
    phoneNumber: string | null;
    email: string | null;
    fax: string | null;
    detailAddress: string | null;
    active: boolean;
  };
};

export type ReceiveInventoryResponse = {
  receiveInventory: Array<{
    id: number;
    code: string;
    createdAt: Date;
    warehouse: {
      id: number;
      name: string;
    };
    status: string;
    transactionStatus: string;
    supplier: {
      id: number;
      name: string;
    };
    createUser: {
      id: number;
      name: string;
    };
    totalItems: number;
    expectedAt: string | null;
    note: null | string;
    totalReceipt: number;
  }>;
  paginition: PaginitionData;
};
