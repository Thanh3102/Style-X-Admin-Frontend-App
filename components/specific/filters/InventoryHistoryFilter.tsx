"use client";
import { getWarehouse } from "@/app/api/warehouses";
import { WarehousesResponse } from "@/app/api/warehouses/warehouses.type";
import { isInteger } from "@/libs/helper";
import { FilterParam, InventoryTransactionType } from "@/libs/types/backend";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { getSession, useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdOutlineFilterAltOff } from "react-icons/md";

const InventoryHistoryFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [warehouses, setWarehouses] = useState<WarehousesResponse[]>([]);
  const [type, setType] = useState("");
  const [warehouseIds, setWarehouseIds] = useState("");

  const fetchWarehouses = async () => {
    try {
      const session = await getSession();
      const data = await getWarehouse(session?.accessToken);
      setWarehouses(data);
    } catch (e) {}
  };

  const handleTypeChange = (type: string) => {
    setType(type);
    const search = new URLSearchParams(searchParams);
    if (!type) {
      search.delete(FilterParam.TYPE);
    } else {
      search.set(FilterParam.TYPE, type);
    }
    router.replace(`${pathname}?${search.toString()}`);
  };

  const handleWarehouseChange = (ids: string[]) => {
    const search = new URLSearchParams(searchParams);

    if (ids.length === 0) {
      search.delete(FilterParam.WAREHOUSE_IDS);
    } else {
      const value = ids.join(",");
      setWarehouseIds(value);
      search.set(FilterParam.WAREHOUSE_IDS, value);
    }
    router.replace(`${pathname}?${search.toString()}`);
  };

  const handleDeleteFilter = () => {
    // router.replace(`${pathname}`);
    handleTypeChange("");
    handleWarehouseChange([]);
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  useEffect(() => {
    setType(searchParams.get(FilterParam.TYPE) ?? "");
    setWarehouseIds(searchParams.get(FilterParam.WAREHOUSE_IDS) ?? "");
  }, [searchParams]);

  return (
    <div className="p-5 rounded-md bg-white">
      <div className="flex flex-wrap gap-y-4 -mx-2 [&>*]:px-2 items-center ">
        <div className="min-w-[300px] w-1/4">
          <Select
            label="Loại giao dịch"
            placeholder="Chọn loại giao dịch"
            variant="bordered"
            radius="sm"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={[type]}
            onSelectionChange={(key) => {
              handleTypeChange(Array.from(key)[0] as string);
            }}
          >
            <SelectItem key={""}>Tất cả</SelectItem>
            <SelectItem key={InventoryTransactionType.ORDER}>
              Đơn hàng
            </SelectItem>
            <SelectItem key={InventoryTransactionType.PRODUCT}>
              Sản phẩm
            </SelectItem>
            <SelectItem key={InventoryTransactionType.PURCHASE_ORDER}>
              Đặt hàng nhập
            </SelectItem>
            <SelectItem key={InventoryTransactionType.RECEIVE_INVENTORY}>
              Nhập hàng
            </SelectItem>
          </Select>
        </div>
        <div className="min-w-[300px] w-1/4">
          <Select
            label="Kho hàng"
            placeholder="Chọn kho hàng"
            variant="bordered"
            radius="sm"
            selectionMode="multiple"
            // disallowEmptySelection
            selectedKeys={warehouseIds.split(",").filter((id) => isInteger(id))}
            onSelectionChange={(key) =>
              handleWarehouseChange(Array.from(key) as string[])
            }
          >
            {warehouses.map((warehouse) => (
              <SelectItem key={warehouse.id}>{warehouse.name}</SelectItem>
            ))}
          </Select>
        </div>
        {/* <Button
          color="warning"
          variant="bordered"
          radius="sm"
          endContent={<MdOutlineFilterAltOff size={18} />}
          className="text-yellow-500"
          onClick={handleDeleteFilter}
        >
          Xóa bộ lọc
        </Button> */}
      </div>
    </div>
  );
};

export { InventoryHistoryFilter };
