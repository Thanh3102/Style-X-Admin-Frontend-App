export const DashboardRoute = "/dashboard";

export const ProductRoute = "/products";
export const CreateProductRoute = `${ProductRoute}/create`;
export const EditVariantRoute = (
  productId: number | string,
  variantId: number | string
) => `${ProductRoute}/${productId}/variants/${variantId}`;

export const OrdersRoute = "/orders";

export const InventoriesRoute = "/inventories";
export const InventoriesHistoryRoute = (variantId: number | string) =>
  `/inventories/${variantId}/history`;

export const PurchaseOrderRoute = "/purchase-orders";

export const ReceiveInventoryRoute = "/receive-inventory";

export const CreateReceiveInventoryRoute = `${ReceiveInventoryRoute}/create`;

export const SuppliersRoute = "/suppliers";
export const CreateSupplierRoute = `${SuppliersRoute}/create`;
export const SupplierDetailRoute = (supplierId: string | number) =>
  `${SuppliersRoute}/${supplierId}`;

export const DiscountsRoute = "/discounts";
export const ReportsRoute = "/reports";
export const AccountsRoute = "/accounts";
export const CustomizeRoute = "/customize";
