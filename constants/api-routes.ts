const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

// Auth Route
export const SIGN_IN_ROUTE = `${SERVER_BASE_URL}/auth/employee/sign-in`;
export const REFRESH_TOKEN_ROUTE = `${SERVER_BASE_URL}/auth/refreshToken`;

// Employee Route
export const EMPLOYEE_GET_ROUTE = `${SERVER_BASE_URL}/api/employee`;

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
export const GET_DISCOUNTS = `${SERVER_BASE_URL}/api/discount`
export const GET_DISCOUNT_DETAIL = (id: number) =>
  `${SERVER_BASE_URL}/api/discount/${id}`;
export const POST_CREATE_DISCOUNT = `${SERVER_BASE_URL}/api/discount`;
export const PUT_UPDATE_DISCOUNT = `${SERVER_BASE_URL}/api/discount`;
export const PUT_UPDATE_DISCOUNT_ACTIVE = `${SERVER_BASE_URL}/api/discount/active`;
export const DELETE_DISCOUNT = `${SERVER_BASE_URL}/api/discount`;
