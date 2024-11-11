"use client";
import {
  Button,
  Input,
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
} from "@nextui-org/react";
import { ProductVariant } from "./FormCreateProduct";
import { FormInput } from "../common/Form";
import { CurrencyFormatter } from "@/libs/format-helper";
import { FaDongSign } from "react-icons/fa6";
import { useImmer } from "use-immer";
import { useCallback } from "react";
import RenderIf from "../ui/RenderIf";

type Props = {
  variant: ProductVariant | undefined;
  onSave?: (variant: ProductVariant) => void;
} & Omit<ModalProps, "children">;

/*

  Chưa validate

*/

const ProductVariantEditModal = (props: Props) => {
  const { variant, onSave, ...restProps } = props;

  if (!variant) return <>No variant</>;

  const [thisVariant, setThisVariant] = useImmer<ProductVariant>(variant);

  const handlePriceChange = (
    value: string,
    field: "sellPrice" | "costPrice" | "comparePrice"
  ) => {
    setThisVariant((variant) => {
      variant[field] = parseInt(value);
      return variant;
    });
  };

  const handleOnHandChange = useCallback(
    (value: string, warehouseId: number) => {
      setThisVariant((variant) => {
        const index = variant.warehouses.findIndex(
          (wh) => wh.id === warehouseId
        );
        if (index !== -1) {
          variant.warehouses[index].onHand = !isNaN(parseInt(value))
            ? parseInt(value)
            : 0;
          return variant;
        }
        return variant;
      });
    },
    []
  );

  return (
    <Modal {...restProps}>
      <ModalContent className="min-w-[50vw]">
        {(onclose) => (
          <>
            <ModalHeader>Chỉnh sửa {variant.title}</ModalHeader>
            <ModalBody>
              <form className="flex flex-wrap gap-y-2 -mx-2 [&>*]:px-2 max-h-[50vh] overflow-y-auto">
                <div className="col-6">
                  <FormInput
                    aria-label="Mã SKU"
                    label="Mã SKU"
                    placeholder="Nhập mã SKU"
                    value={thisVariant.skuCode}
                    onValueChange={(value) =>
                      setThisVariant((variant) => {
                        variant.skuCode = value;
                        return variant;
                      })
                    }
                  />
                </div>
                <div className="col-6">
                  <FormInput
                    aria-label="Mã vạch/ Barcode"
                    label="Mã vạch/ Barcode"
                    placeholder="Nhập mã vạch"
                    value={thisVariant.barCode}
                    onValueChange={(value) =>
                      setThisVariant((variant) => {
                        variant.barCode = value;
                        return variant;
                      })
                    }
                  />
                </div>
                <div className="col-6">
                  <FormInput
                    aria-label="Giá bán"
                    type="number"
                    label="Giá bán"
                    placeholder="Nhập giá bán"
                    step={1000}
                    value={thisVariant?.sellPrice.toString()}
                    endContent={<FaDongSign className="text-gray-500" />}
                    description={`Giá bán: ${CurrencyFormatter().format(
                      thisVariant?.sellPrice
                    )}`}
                    onValueChange={(value) =>
                      handlePriceChange(value, "sellPrice")
                    }
                  />
                </div>
                <div className="col-6">
                  <FormInput
                    aria-label="Giá so sánh"
                    type="number"
                    label="Giá so sánh"
                    placeholder="Nhập giá so sánh"
                    step={1000}
                    value={thisVariant?.comparePrice.toString()}
                    endContent={<FaDongSign className="text-gray-500" />}
                    description={`Giá so sánh: ${CurrencyFormatter().format(
                      thisVariant?.comparePrice
                    )}`}
                    onValueChange={(value) =>
                      handlePriceChange(value, "comparePrice")
                    }
                  />
                </div>
                <div className="col-6">
                  <FormInput
                    aria-label="Giá vốn"
                    type="number"
                    label="Giá vốn"
                    placeholder="Nhập giá vốn"
                    step={1000}
                    value={thisVariant?.costPrice.toString()}
                    endContent={<FaDongSign className="text-gray-500" />}
                    description={`Giá vốn: ${CurrencyFormatter().format(
                      thisVariant?.costPrice
                    )}`}
                    onValueChange={(value) =>
                      handlePriceChange(value, "costPrice")
                    }
                  />
                </div>
                <div className="col-6">
                  <FormInput
                    aria-label="Đơn vị tính"
                    label="Đơn vị tính"
                    placeholder="Nhập đơn vị tính"
                    value={thisVariant.unit}
                    onValueChange={(value) =>
                      setThisVariant((variant) => {
                        variant.unit = value;
                        return variant;
                      })
                    }
                  />
                </div>
                <RenderIf condition={thisVariant.warehouses.length > 0}>
                  <div className="col-12">
                    <Table aria-label="Variant Warehouse" removeWrapper>
                      <TableHeader>
                        <TableColumn key={"kholuutru"}>Kho lưu trữ</TableColumn>
                        <TableColumn key={"tonkho"}>Tồn kho</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {thisVariant.warehouses.map((warehouse) => (
                          <TableRow key={warehouse.id}>
                            <TableCell>{warehouse.name}</TableCell>
                            <TableCell>
                              <Input
                                aria-label="Variant Warehouse Onhand"
                                variant="bordered"
                                radius="sm"
                                value={warehouse.onHand.toString()}
                                onValueChange={(value) =>
                                  handleOnHandChange(value, warehouse.id)
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </RenderIf>
              </form>
            </ModalBody>
            <ModalFooter className="flex justify-end gap-4">
              <Button
                size="sm"
                radius="sm"
                variant="bordered"
                onClick={() => onclose()}
              >
                Hủy
              </Button>
              <Button
                size="sm"
                radius="sm"
                color="primary"
                onClick={() => {
                  onSave && onSave(thisVariant);
                  onclose();
                }}
              >
                Lưu
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default ProductVariantEditModal;