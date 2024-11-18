export type GetVariantInventoryWarehousesResponse = {
  id: number;
  name: string;
}[];

export type GetInventoriesHistoryResponse = {
  inventoryHistory: {
    id: number;
    avaiableQuantityChange: number;
    onHandQuantityChange: number;
    OnTransactionQuantityChange: number;
    onReceiveQuantityChange: number;
    newAvaiable: number | null;
    newOnHand: number | null;
    newOnTransaction: number | null;
    newOnReceive: number | null;
    transactionType: string;
    transactionAction: string;
    reason: string;
    changeOn: Date;
    changeUserId: number;
    inventoryId: number;
    changeUser: {
      name: string;
    };
    inventory: {
      warehouse: {
        name: string;
      };
    };
  }[];
  paginition: {
    total: number;
    count: number;
    page: number;
    limit: number;
  };
};
