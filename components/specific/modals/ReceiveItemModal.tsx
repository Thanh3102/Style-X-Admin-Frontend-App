"use client";
import { ReceiveInventoryDetail } from "@/app/api/receive-inventory/receive-inventory.type";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Image,
  Tooltip,
  Input,
} from "@nextui-org/react";
import NextImage from "next/image";
import { ImagePlaceholderPath } from "@/constants/filepath";
import Link from "next/link";
import { EditVariantRoute } from "@/constants/route";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { isInteger } from "@/libs/helper";
import { getSession } from "next-auth/react";
import { PUT_IMPORT_ITEMS } from "@/constants/api-routes";
import { useRouter } from "next/navigation";

type Props = {
  receiveInventory: ReceiveInventoryDetail;
} & Omit<ModalProps, "children">;

type ReceiveItem = {
  importQuantity: number;
} & ReceiveInventoryDetail["items"][number];

const ReceiveItemModal = ({ receiveInventory, ...props }: Props) => {
  const [receiveItems, setReceiveItems] = useState<ReceiveItem[]>(() => {
    const init: ReceiveItem[] = [];
    receiveInventory.items.forEach((item) => {
      if (item.quantityRemain > 0) {
        init.push({
          ...item,
          importQuantity: item.quantityRemain,
        });
      }
    });
    return init;
  });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleInputQuantityChange = (value: string, item: ReceiveItem) => {
    let newValue = isInteger(value) ? parseInt(value) : 0;
    if (newValue < 0) newValue = 0;
    if (newValue > item.quantityRemain) newValue = item.quantityRemain;
    setReceiveItems((receiveItems) => {
      const newItems: ReceiveItem[] = [];
      receiveItems.forEach((i) => {
        if (i.id === item.id)
          newItems.push({ ...item, importQuantity: newValue });
        else {
          newItems.push(i);
        }
      });
      console.log("new items", newItems);

      return newItems;
    });
  };

  const handleSave = async (onClose: () => void) => {
    let isValueNotZero = false;
    for (const item of receiveItems) {
      if (
        item.importQuantity > item.quantityRemain ||
        item.importQuantity < 0
      ) {
        toast.error(
          `Số lượng nhập ${item.variant.product.name}(${item.variant.title}) không hợp lệ`
        );
        return;
      }
      if (item.importQuantity > 0) isValueNotZero = true;
    }

    if (!isValueNotZero) {
      toast.error("Phải nhập ít nhất 1 sản phẩm");
      return;
    }

    const data = {
      receiveId: receiveInventory.id,
      warehouseId: receiveInventory.warehouse.id,
      importItems: receiveItems.map((item) => {
        return {
          itemId: item.id,
          variantId: item.variant.id,
          importQuantity: item.importQuantity,
        };
      }),
    };

    try {
      setIsLoading(true);
      const session = await getSession();
      const res = await fetch(PUT_IMPORT_ITEMS, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      const response = await res.json();
      setIsLoading(false);

      if (res.ok) {
        toast.success(response.message ?? "Nhập kho thành công");
        router.refresh();
        onClose();
        return;
      } else {
        toast.error(response.error ?? "Đã xảy ra lỗi");
      }
    } catch (error) {}
  };

  return (
    <Modal {...props}>
      <ModalContent className="min-w-[50vw]">
        {(onClose) => (
          <>
            <ModalHeader>
              Nhập hàng từ đơn nhập {receiveInventory.code}
            </ModalHeader>
            <ModalBody>
              <div className="max-h-full overflow-y-auto">
                <Table removeWrapper isHeaderSticky>
                  <TableHeader>
                    <TableColumn>Sản phẩm</TableColumn>
                    <TableColumn>Số lượng nhập</TableColumn>
                  </TableHeader>
                  <TableBody items={receiveItems}>
                    {(item) => (
                      <TableRow>
                        <TableCell>
                          <div className="flex gap-2 items-center">
                            <Image
                              as={NextImage}
                              alt=""
                              src={ImagePlaceholderPath}
                              width={40}
                              height={40}
                            />
                            <div className="flex flex-col gap-1">
                              <Link
                                href={EditVariantRoute(
                                  item.variant.product.id,
                                  item.variant.id
                                )}
                                target="_blank"
                              >
                                <span className="label-link line-clamp-1">
                                  {item.variant.product.name}
                                </span>
                              </Link>
                              <span className="line-clamp-1">
                                {item.variant.title}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              variant="underlined"
                              radius="sm"
                              size="sm"
                              min={0}
                              max={item.quantityRemain}
                              value={item.importQuantity.toString()}
                              onValueChange={(value) =>
                                handleInputQuantityChange(value, item)
                              }
                            />
                            <span className="line-clamp-1 min-w-fit">
                              / {item.quantityRemain}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="flex gap-4">
                <Button
                  color="primary"
                  radius="sm"
                  variant="bordered"
                  onClick={onClose}
                >
                  Đóng
                </Button>
                <Button
                  color="primary"
                  radius="sm"
                  onClick={() => handleSave(onClose)}
                  isLoading={isLoading}
                  isDisabled={isLoading}
                >
                  Nhập
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default ReceiveItemModal;
