export enum TagType {
  SUPPLIER = "supplier",
  PRODUCT = "product",
  RECEIVE_INVENTORY = "receive_inventory",
}

export type ResponseTag = string;

export type GetTagResponse = {
  tags: ResponseTag[];
};

export enum FilterParam {
  CREATED_ON = "createdOn",
  CREATED_ON_MIN = "createdOnMin",
  CREATED_ON_MAX = "createdOnMax",
  PAGE = "page",
  LIMIT = "limit",
  QUERY = "query",
  TAG_TYPE = "tagType",
  ASSIGN_IDS = "assignIds",
  ACTIVE = "active",
  MODE = "mode",
  TYPE = "type",
  RECEIVE_IDS = "receiveIds",
  VARIANT_IDS = "variantIds",
  REPORT_DATE = "reportDate",
  REPORT_DATE_MIN = "reportDateMin",
  REPORT_DATE_MAX = "reportDateMax",
  SORTBY = "sortBy",
  ORDER_STATUS = "orderStatus",
  RECEIVE_STATUS = "receiveStatus",
  RECEIVE_TRANSACTION_STATUS = "receiveTransactionStatus",
}

export type QueryParams = Partial<Record<FilterParam, string>>;

export type DateFilterOption = {
  label: string;
  value: DateFilterOptionValue;
};

export enum DateFilterOptionValue {
  TODAY = "today",
  YESTERDAY = "yesterday",
  DAY_LAST_7 = "day_last_7",
  DAY_LAST_30 = "day_last_30",
  LAST_WEEK = "last_week",
  THIS_WEEK = "this_week",
  LAST_MONTH = "last_month",
  THIS_MONTH = "this_month",
  LAST_YEAR = "last_year",
  THIS_YEAR = "this_year",
  OPTION = "date_option",
}

export type DetailSuppler = {
  id: number;
  code: string;
  country: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
  active: boolean;
  createdAt: Date;
  email: string;
  phoneNumber: string;
  fax: string;
  name: string;
  taxCode: string;
  website: string;
  tags: string[];
  assigned: BasicUser;
  receives: Array<{
    id: number;
    code: string;
    status: string;
    transactionStatus: string;
    totalReceipt: number;
    transactionRemainAmount: number;
    totalItems: number;
    createdAt: string;
  }>;
};

export type BasicUser = {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  createdAt: Date;
  username: string;
  gender: boolean;
  dateOfBirth: Date;
  lastLoginAt: Date;
};

export enum ReceiveInventoryTransaction {
  UN_PAID = "Chưa thanh toán",
  PARTIALLY_PAID = "Thanh toán một phần",
  PAID = "Đã thanh toán",
}

export enum ReceiveInventoryStatus {
  NOT_RECEIVED = "Chưa nhập hàng",
  PARTIALLY_RECEIVED = "Nhập một phần",
  RECEIVED = "Đã nhập hàng",
  CANCEL = "Hủy đơn",
}

export enum PaymentMethod {
  CASH = "Tiền mặt",
  BANKING = "Chuyển khoản",
}

export enum DashboardPermission {
  Access = "dashboard_access",
}

export enum ProductPermission {
  Access = "product_access",
  Create = "product_create",
  Update = "product_update",
  Delete = "product_delete",
}

export enum OrderPermission {
  StatusUpdate = "order_status_update",
  Cancel = "order_cancel",
  Delete = "order_delete",
  Access = "order_access",
}

export enum CategoryPermission {
  Access = "category_access",
  Create = "category_create",
  Update = "category_update",
  Delete = "category_delete",
}

export enum ReceiveInventoryPermission {
  Access = "receive_access",
  Create = "receive_create",
  Update = "receive_update",
  Cancel = "receive_cancel",
  Delete = "receive_delete",
  Import = "receive_import",
  Transaction = "receive_transaction",
}

export enum SupplierPermission {
  Access = "supplier_access",
  Create = "supplier_create",
  Update = "supplier_update",
  Delete = "supplier_delete",
}

export enum CustomerPermission {
  Access = "customer_access",
}

export enum DiscountPermission {
  Access = "discount_access",
  Create = "discount_create",
  Update = "discount_update",
  Delete = "discount_delete",
}

export enum EmployeePermission {
  Access = "employee_access",
  Create = "employee_create",
  Update = "employee_update",
  Delete = "employee_delete",
}

export enum RolePermission {
  Access = "role_access",
  Create = "role_create",
  Update = "role_update",
  Delete = "role_delete",
}
