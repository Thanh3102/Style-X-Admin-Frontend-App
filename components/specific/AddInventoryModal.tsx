"use client";
import {
  GET_WAREHOUSE_ROUTE,
  POST_CREATE_INVENTORIES_ROUTE,
} from "@/constants/api-routes";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { getSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { FormInput, FormSelect } from "../common/Form";
import { useImmer } from "use-immer";
import toast from "react-hot-toast";
import { Variant } from "./forms/FormEditVariant";
import RenderIf from "../ui/RenderIf";
import { useRouter } from "next/navigation";

type Warehouse = { id: number; name: string };

type SelectedWarehouse = { id: number; name: string; onHand: number };

type Props = { variant: Variant } & Omit<ModalProps, "children">;

const AddInventoryModal = ({ variant, ...props }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [warehouses, setWarehouses] = useImmer<Warehouse[]>([]);
  const [selectedWarehouses, setSelectedWarehouses] = useImmer<
    SelectedWarehouse[]
  >([]);

  const router = useRouter();

  const disableWarehouses = variant.inventories.map((inv) =>
    inv.warehouse.id.toString()
  );

  const handleSave = useCallback(
    async (onClose: () => void) => {
      if (selectedWarehouses.length === 0) {
        toast.error("Chưa chọn kho lưu trữ");
        return;
      }
      try {
        setIsLoading(true);
        const session = await getSession();
        const res = await fetch(`${POST_CREATE_INVENTORIES_ROUTE}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify({
            warehouses: selectedWarehouses,
            variantId: variant.id,
          }),
        });
        setIsLoading(true);

        const data = await res.json();

        if (res.ok) {
          toast.success(data.message ?? "Lưu thành công");
          router.refresh();
          onClose();
          return;
        }

        toast.error(data.message || data.error || "Đã xảy ra lỗi");
      } catch (error: any) {
        toast.error(error.message ?? "Đã xảy ra lỗi");
      }
    },
    [selectedWarehouses]
  );

  const getWarehouse = useCallback(async () => {
    try {
      const session = await getSession();
      const res = await fetch(`${GET_WAREHOUSE_ROUTE}`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        cache: "force-cache",
      });

      if (res.ok) {
        const data = (await res.json()) as Warehouse[];
        setWarehouses(data);
      }
    } catch (error: any) {
      toast.error(error.message ?? "Đã xảy ra lỗi khi tải dữ liệu");
    }
  }, []);

  const handleWarehouseSelect = useCallback(
    (key: string[]) => {
      setSelectedWarehouses((selecteds) => {
        if (key.length === 0) return [];

        const keySet = new Set(key);

        const keepedSelectedWarehouses = selecteds.filter((selected) => {
          if (key.includes(selected.id.toString())) {
            keySet.delete(selected.id.toString());
            return true;
          }
          return false;
        });

        const newSelectedWarehouse: SelectedWarehouse[] = [];

        keySet.forEach((key) => {
          const index = warehouses.findIndex(
            (warehouse) => warehouse.id.toString() === key
          );
          newSelectedWarehouse.push({
            id: warehouses[index].id,
            name: warehouses[index].name,
            onHand: 0,
          });
        });

        return [...keepedSelectedWarehouses, ...newSelectedWarehouse];
      });
    },
    [selectedWarehouses, warehouses]
  );

  const handleOnHandChange = useCallback(
    (value: string, warehouseId: number) => {
      const maxValue = 1e9;
      setSelectedWarehouses((whs) => {
        const index = whs.findIndex((wh) => wh.id === warehouseId);
        if (index !== -1) {
          const parseValue = !isNaN(parseInt(value)) ? parseInt(value) : 0;
          whs[index].onHand = parseValue <= maxValue ? parseValue : maxValue;
          return whs;
        }
        return whs;
      });
    },
    []
  );

  useEffect(() => {
    getWarehouse();
  }, []);

  return (
    <Modal {...props}>
      <ModalContent>
        {(onClose) => (
          <ModalContent>
            <ModalHeader>Thêm kho lưu trữ</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <FormSelect
                  aria-label="Lưu trữ tại kho"
                  label="Lưu trữ tại kho"
                  placeholder="Chọn kho lưu trữ"
                  selectionMode="multiple"
                  disabledKeys={disableWarehouses}
                  onSelectionChange={(key) =>
                    handleWarehouseSelect(Array.from(key) as string[])
                  }
                >
                  {warehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id}>{warehouse.name}</SelectItem>
                  ))}
                </FormSelect>
                <RenderIf condition={selectedWarehouses.length > 0}>
                  <Table
                    removeWrapper
                    className="mt-4"
                    aria-label="Bảng tồn kho"
                  >
                    <TableHeader>
                      <TableColumn key={"kholuutru"} className="w-3/5">
                        Kho lưu trữ
                      </TableColumn>
                      <TableColumn>Tồn kho</TableColumn>
                    </TableHeader>
                    <TableBody items={selectedWarehouses}>
                      {(warehouse) => (
                        <TableRow key={warehouse.id}>
                          <TableCell>{warehouse.name}</TableCell>
                          <TableCell>
                            <FormInput
                              aria-label="Só lượng tồn kho"
                              type="number"
                              placeholder="Nhập số lượng tồn kho"
                              min={0}
                              value={warehouse.onHand.toString()}
                              onValueChange={(value) =>
                                handleOnHandChange(value, warehouse.id)
                              }
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </RenderIf>
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="flex gap-4">
                <Button
                  radius="sm"
                  variant="bordered"
                  color="primary"
                  onClick={() => onClose()}
                >
                  Đóng
                </Button>
                <Button
                  radius="sm"
                  color="primary"
                  onClick={() => handleSave(onClose)}
                >
                  Lưu
                </Button>
              </div>
            </ModalFooter>
          </ModalContent>
        )}
      </ModalContent>
    </Modal>
  );
};
export default AddInventoryModal;
