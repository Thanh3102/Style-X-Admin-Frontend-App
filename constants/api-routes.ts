const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

// Auth Route
export const SIGN_IN_ROUTE = `${SERVER_BASE_URL}/auth/employee/sign-in`;
export const REFRESH_TOKEN_ROUTE = `${SERVER_BASE_URL}/auth/refreshToken`;

// Employee Route
export const EMPLOYEE_GET_ROUTE = `${SERVER_BASE_URL}/api/employee`;

// Product
export const GET_ALL_CATEGORIES_ROUTE = `${SERVER_BASE_URL}/api/product/getAllCategories`;

// Supplier
export const CREATE_SUPPLIER_ROUTE = `${SERVER_BASE_URL}/api/suppliers/create`;
export const UPDATE_SUPPLIER_ROUTE = `${SERVER_BASE_URL}/api/suppliers`;
export const DELETE_SUPPLIER_ROUTE = `${SERVER_BASE_URL}/api/suppliers`;
export const GET_SUPPLIER_ROUTE = `${SERVER_BASE_URL}/api/suppliers`;
export const GET_SUPPLIER_DETAIL_ROUTE = `${SERVER_BASE_URL}/api/suppliers/detail`;

// Tag
export const GET_TAG_ROUTE = `${SERVER_BASE_URL}/api/tags`;
