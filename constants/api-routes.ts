const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

// Auth Route
export const SIGN_IN_ROUTE = `${SERVER_BASE_URL}/auth/employee/sign-in`;
export const REFRESH_TOKEN_ROUTE = `${SERVER_BASE_URL}/auth/refreshToken`;

// Employee Route
export const EMPLOYEE_GET_ROUTE = `${SERVER_BASE_URL}/api/employee`;

// Product
export const GET_PRODUCT_ROUTE = `${SERVER_BASE_URL}/api/product`;
export const GET_PRODUCT_DETAIL_ROUTE = `${SERVER_BASE_URL}/api/product`;
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

export const GET_INVENTORIES_HISTORY_ROUTE = (variantId: string | number) =>
  `${SERVER_BASE_URL}/api/inventories/${variantId}/history`;

export const POST_CREATE_INVENTORIES_ROUTE = `${SERVER_BASE_URL}/api/inventories`;
export const PUT_CHANGE_ON_HAND_INVENTORIES_ROUTE = `${SERVER_BASE_URL}/api/inventories/changeOnHand`;
