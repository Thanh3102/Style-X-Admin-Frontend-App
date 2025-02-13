const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

// Auth Route
export const SIGN_IN_ROUTE = `${SERVER_BASE_URL}/auth/employee/sign-in`;
export const REFRESH_TOKEN_ROUTE = `${SERVER_BASE_URL}/auth/refreshToken`;

// Employee Route
export const EMPLOYEE_GET_ROUTE = `${SERVER_BASE_URL}/api/employee`;
export const GET_ROLES_ROUTE = `${SERVER_BASE_URL}/api/employee/roles`;
export const GET_PERMISSION_ROUTE = `${SERVER_BASE_URL}/api/employee/permissions`;
export const CREATE_ROLE_ROUTE = `${SERVER_BASE_URL}/api/employee/roles`;
export const UPDATE_ROLE_ROUTE = `${SERVER_BASE_URL}/api/employee/roles`;
export const DELETE_ROLE_ROUTE = `${SERVER_BASE_URL}/api/employee/roles`;
export const CREATE_EMPLOYEE_ROUTE = `${SERVER_BASE_URL}/api/employee`;
export const UPDATE_EMPLOYEE_ROUTE = `${SERVER_BASE_URL}/api/employee`;
export const DELETE_EMPLOYEE_ROUTE = `${SERVER_BASE_URL}/api/employee`;
export const GET_USER_INFO_ROUTE = `${SERVER_BASE_URL}/api/employee/me`;
export const CHANGE_PASSWORD_ROUTE = `${SERVER_BASE_URL}/api/employee/change-password`;
export const GET_USER_PERMISSIONS_ROUTE = `${SERVER_BASE_URL}/api/employee/current-permission`;

// Customer Route
export const CUSTOMER_GET_ROUTE = `${SERVER_BASE_URL}/api/customer`;
export const GET_CUSTOMER_DETAIL_ROUTE = `${SERVER_BASE_URL}/api/customer`;



// Product
export const GET_PRODUCT_ROUTE = `${SERVER_BASE_URL}/api/product`;
export const GET_PRODUCT_DETAIL_ROUTE = (productId: string | number) =>
  `${SERVER_BASE_URL}/api/product/${productId}`;
export const GET_VARIANT_DETAIL_ROUTE = (variantId: string | number) =>
  `${SERVER_BASE_URL}/api/product/variant/${variantId}`;
export const POST_CREATE_PRODUCT_ROUTE = `${SERVER_BASE_URL}/api/product`;
export const POST_ADD_PRODUCT_IMAGE_ROUTE = `${SERVER_BASE_URL}/api/product/images/add`;
export const GET_CATEGORIES_ROUTE = `${SERVER_BASE_URL}/api/product/category`;
export const PUT_UPDATE_PRODUCT_ROUTE = `${SERVER_BASE_URL}/api/product`;
export const PUT_UPDATE_PRODUCT_VARIANT_ROUTE = `${SERVER_BASE_URL}/api/product/variant`;
export const PUT_UPDATE_MAIN_IMAGE_ROUTE = `${SERVER_BASE_URL}/api/product/images/updateMainImage`;
export const DELETE_PRODUCT_IMAGE_ROUTE = `${SERVER_BASE_URL}/api/product/images`;
export const GET_CATEGORY = `${SERVER_BASE_URL}/api/product/category`;
export const POST_CREATE_CATEGORY = `${SERVER_BASE_URL}/api/product/category`;
export const POST_UPDATE_CATEGORY = `${SERVER_BASE_URL}/api/product/category/update`;
export const DELETE_CATEGORY = `${SERVER_BASE_URL}/api/product/category`;
export const GET_COLLECTIONS = `${SERVER_BASE_URL}/api/product/collection`;
export const POST_CREATE_COLLECTION = `${SERVER_BASE_URL}/api/product/collection`;
export const PUT_UPDATE_COLLECTION = `${SERVER_BASE_URL}/api/product/collection`;
export const DELETE_COLLECTION = `${SERVER_BASE_URL}/api/product/collection`;
export const DELETE_PRODUCT = `${SERVER_BASE_URL}/api/product`;
// Supplier
export const CREATE_SUPPLIER_ROUTE = `${SERVER_BASE_URL}/api/suppliers/create`;
export const UPDATE_SUPPLIER_ROUTE = `${SERVER_BASE_URL}/api/suppliers`;
export const DELETE_SUPPLIER_ROUTE = `${SERVER_BASE_URL}/api/suppliers`;
export const GET_SUPPLIER_ROUTE = `${SERVER_BASE_URL}/api/suppliers`;
export const GET_SUPPLIER_DETAIL_ROUTE = `${SERVER_BASE_URL}/api/suppliers/detail`;

// Tag
export const GET_TAG_ROUTE = `${SERVER_BASE_URL}/api/tags`;

// Warehouse
export const GET_WAREHOUSE_ROUTE = `${SERVER_BASE_URL}/api/warehouses`;

// Inventory
export const GET_VARIANT_INVENTORIES_WAREHOUSES_ROUTE = (
  variantId: string | number
) => `${SERVER_BASE_URL}/api/inventories/${variantId}/history`;

export const GET_INVENTORIES_HISTORY_ROUTE = `${SERVER_BASE_URL}/api/inventories/history`;

export const POST_CREATE_INVENTORIES_ROUTE = `${SERVER_BASE_URL}/api/inventories`;
export const PUT_CHANGE_ON_HAND_INVENTORIES_ROUTE = `${SERVER_BASE_URL}/api/inventories/changeOnHand`;

// Receive Inventory
export const GET_RECEIVE_INVENTORY = `${SERVER_BASE_URL}/api/receive-inventory/`;
export const GET_RECEIVE_INVENTORY_DETAIL = (receiveId: number | string) =>
  `${SERVER_BASE_URL}/api/receive-inventory/${receiveId}`;
export const POST_CREATE_RECEIVE_INVENTORY = `${SERVER_BASE_URL}/api/receive-inventory`;
export const POST_PROCESS_PAYMENT_RECEIVE_INVENTORY = `${SERVER_BASE_URL}/api/receive-inventory/processPayment`;
export const PUT_UPDATE_RECEIVE_INVENTORY = `${SERVER_BASE_URL}/api/receive-inventory`;
export const PUT_CANCEL_RECEIVE_INVENTORY = `${SERVER_BASE_URL}/api/receive-inventory/cancel`;
export const PUT_IMPORT_ITEMS = `${SERVER_BASE_URL}/api/receive-inventory/import`;
export const DELETE_RECEIVE_INVENTORY = (receiveId: number | string) =>
  `${SERVER_BASE_URL}/api/receive-inventory/${receiveId}`;

// Discount
export const GET_DISCOUNTS = `${SERVER_BASE_URL}/api/discount`;
export const GET_DISCOUNT_DETAIL = (id: number) =>
  `${SERVER_BASE_URL}/api/discount/${id}`;
export const POST_CREATE_DISCOUNT = `${SERVER_BASE_URL}/api/discount`;
export const PUT_UPDATE_DISCOUNT = `${SERVER_BASE_URL}/api/discount`;
export const PUT_UPDATE_DISCOUNT_ACTIVE = `${SERVER_BASE_URL}/api/discount/active`;
export const DELETE_DISCOUNT = `${SERVER_BASE_URL}/api/discount`;

// Order
export const GET_ORDER_LIST = `${SERVER_BASE_URL}/api/order`;
export const GET_ORDER_DETAIL = `${SERVER_BASE_URL}/api/order/admin`;
export const CONFIRM_DELIVERY_ORDER = `${SERVER_BASE_URL}/api/order/confirm/delivery`;
export const CANCEL_ORDER = `${SERVER_BASE_URL}/api/order/cancel`;
export const CONFIRM_PAYMENT_RECEIVE = `${SERVER_BASE_URL}/api/order/confirm/payment`;
export const DELETE_ORDER = `${SERVER_BASE_URL}/api/order/admin`;

// Report
export const REPORT_OVERVIEW = `${SERVER_BASE_URL}/api/report/overview`;
export const REPORT_REVENUE = `${SERVER_BASE_URL}/api/report/revenue`;
export const REPORT_BEST_SALE = `${SERVER_BASE_URL}/api/report/best-sale`;
export const REPORT_LOW_STOCK = `${SERVER_BASE_URL}/api/report/low-stock`;
export const REPORT_REVENUE_DETAIL = `${SERVER_BASE_URL}/api/report/detail/revenue`;
export const REPORT_PRODUCT_REVENUE_DETAIL = `${SERVER_BASE_URL}/api/report/detail/product`;

// Warehouse
export const WAREHOUSE_CREATE = `${SERVER_BASE_URL}/api/warehouses`;
export const WAREHOUSE_UPDATE = `${SERVER_BASE_URL}/api/warehouses`;
export const WAREHOUSE_DELETE = `${SERVER_BASE_URL}/api/warehouses`;
export const WAREHOUSE_DETAIL = (warehouse_id: number | string) =>
  `${SERVER_BASE_URL}/api/warehouses/${warehouse_id}`;
