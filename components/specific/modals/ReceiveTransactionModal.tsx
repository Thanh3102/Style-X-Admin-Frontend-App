"use client";
import { ReceiveInventoryDetail } from "@/app/api/receive-inventory/receive-inventory.type";
import { POST_PROCESS_PAYMENT_RECEIVE_INVENTORY } from "@/constants/api-routes";
import { cn } from "@/lib/utils";
import { CurrencyFormatter } from "@/libs/format-helper";
import {
  PaymentMethod,
  ReceiveInventoryTransaction,
} from "@/libs/types/backend";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalTimeZone, now, today } from "@internationalized/date";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  Input,
  DatePicker,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { submitHandler } from "ckeditor5";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type Props = {
  receiveInventory: ReceiveInventoryDetail;
} & Omit<ModalProps, "children">;

const schema = z.object({
  transactionDate: z.date().optional(),
  transactionAmount: z.number(),
  transactionMethod: z.string().optional(),
});

type FormField = z.infer<typeof schema>;

const ReceiveTransactionModal = ({ receiveInventory, ...props }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register, setValue, handleSubmit } = useForm<FormField>({
    resolver: zodResolver(schema),
    defaultValues: {
      transactionAmount: receiveInventory.transactionRemainAmount,
      transactionMethod: PaymentMethod.CASH,
      transactionDate: new Date(),
    },
  });

  const onSubmit = async (
    data: {
      transactionDate?: Date | undefined;
      transactionAmount: number;
      transactionMethod?: string | undefined;
    },
    onClose: () => void
  ) => {
    if (
      data.transactionAmount > receiveInventory.transactionRemainAmount ||
      data.transactionAmount <= 0
    ) {
      toast.error("Số tiền thanh toán hợp lệ");
      return;
    }
    try {
      setIsLoading(true);
      const session = await getSession();
      const res = await fetch(POST_PROCESS_PAYMENT_RECEIVE_INVENTORY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          ...data,
          receiveId: receiveInventory.id,
        }),
      });
      const response = await res.json();
      setIsLoading(false);
      if (res.ok) {
        toast.success(response.message ?? "Cập nhật thành công");
        router.refresh();
        onClose();
        return;
      }

      toast.error(response.error ?? "Đã xảy ra lỗi");
    } catch (error) {
      toast.error("Đã xảy ra lỗi");
    }
  };

  return (
    <Modal {...props}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              Thanh toán đơn nhập {receiveInventory.code}
            </ModalHeader>
            <ModalBody>
              <form
                className="flex justify-between items-center font-semibold"
                id="ReceiveTransactionForm"
                onSubmit={handleSubmit((data) => onSubmit(data, onClose))}
              >
                <span>Tiền cần trả NCC</span>
                <span>
                  {CurrencyFormatter().format(
                    receiveInventory.transactionRemainAmount
                  )}
                </span>
              </form>
              <div className={cn("gap-y-4 -mx-2 [&>*]:px-2 flex-wrap flex")}>
                <DatePicker
                  label="Ngày thanh toán"
                  variant="bordered"
                  radius="sm"
                  labelPlacement="outside"
                  hideTimeZone
                  showMonthAndYearPickers
                  maxValue={today(getLocalTimeZone()).add({ days: 1 })}
                  defaultValue={now(getLocalTimeZone())}
                  className="col-6"
                  onChange={(value) =>
                    setValue("transactionDate", value.toDate(), {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                />
                <Input
                  label="Số tiền thanh toán"
                  type="number"
                  labelPlacement="outside"
                  variant="bordered"
                  radius="sm"
                  className="col-6"
                  defaultValue="0"
                  min={0}
                  max={1e12}
                  {...register("transactionAmount", { valueAsNumber: true })}
                />
                <Select
                  label="Phương thức thanh toán"
                  defaultSelectedKeys={[PaymentMethod.CASH]}
                  selectionMode="single"
                  variant="bordered"
                  radius="sm"
                  labelPlacement="outside"
                  className="col-12"
                  onSelectionChange={(key) =>
                    setValue("transactionMethod", key.anchorKey, {
                      shouldDirty: true,
                    })
                  }
                >
                  {Object.values(PaymentMethod).map((key) => (
                    <SelectItem key={key}>{key}</SelectItem>
                  ))}
                </Select>
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
                  isLoading={isLoading}
                  isDisabled={isLoading}
                  form="ReceiveTransactionForm"
                  type="submit"
                >
                  Thanh toán
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default ReceiveTransactionModal;
