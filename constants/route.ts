import { FilterParam } from "@/libs/types/backend";

export const DashboardRoute = "/dashboard";

export const ProductRoute = "/products";
export const CreateProductRoute = `${ProductRoute}/create`;
export const ProductDetailRoute = (id: string | number) =>
  `${ProductRoute}/${id}`;
export const EditVariantRoute = (
  productId: number | string,
  variantId: number | string
) => `${ProductRoute}/${productId}/variants/${variantId}`;

export const OrdersRoute = "/orders";

export const InventoriesRoute = "/inventories";
export const InventoriesHistoryRoute = (variantId: number | string) =>
  `/inventories/history?${FilterParam.VARIANT_IDS}=${variantId}`;

export const PurchaseOrderRoute = "/purchase-orders";

export const ReceiveInventoryRoute = "/receive-inventory";
export const ReceiveInventoryDetailRoute = (receiveId: string | number) =>
  `/receive-inventory/${receiveId}`;
export const ReceiveInventoryImportHistoryRoute = (
  receiveId: string | number
) => `/inventories/history?${FilterParam.RECEIVE_IDS}=${receiveId}`;
export const CreateReceiveInventoryRoute = `${ReceiveInventoryRoute}/create`;

export const SuppliersRoute = "/suppliers";
export const CreateSupplierRoute = `${SuppliersRoute}/create`;
export const SupplierDetailRoute = (supplierId: string | number) =>
  `${SuppliersRoute}/${supplierId}`;

export const DiscountsRoute = "/discounts";
export const CreateCoupouDiscountRoute = `${DiscountsRoute}/create`;
export const CreatePromotionDiscountRoute = `${DiscountsRoute}/promotion/create`;
export const EditDiscountRoute = (id: string | number) =>
  `${DiscountsRoute}/${id}`;

export const ReportsRoute = "/reports";
export const AccountsRoute = "/accounts";
export const CustomizeRoute = "/customize";
