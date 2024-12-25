"use client";
import { TagSeletor } from "@/components/common/TagSelector";
import { GroupBox } from "@/components/ui/GroupBox";
import {
  ReceiveInventoryStatus,
  ReceiveInventoryTransaction,
  TagType,
} from "@/libs/types/backend";
import { useCallback, useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Divider,
  Input,
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  Image,
  Tooltip,
  Accordion,
  AccordionItem,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { CurrencyFormatter } from "@/libs/format-helper";
import { getSession } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/libs/utils";
import {
  CalendarDate,
  getLocalTimeZone,
  parseDate,
  parseDateTime,
  today,
} from "@internationalized/date";
import RenderIf from "@/components/ui/RenderIf";
import ConfirmModal from "../ConfirmModal";
import {
  EditVariantRoute,
  ReceiveInventoryImportHistoryRoute,
  ReceiveInventoryRoute,
} from "@/constants/route";
import { useRouter } from "next/navigation";
import {
  DELETE_RECEIVE_INVENTORY,
  POST_CREATE_RECEIVE_INVENTORY,
  PUT_UPDATE_RECEIVE_INVENTORY,
} from "@/constants/api-routes";
import { ImagePlaceholderPath } from "@/constants/filepath";
import NextImage from "next/image";
import { ReceiveInventoryDetail } from "@/app/api/receive-inventory/receive-inventory.type";
import { convertDateToString } from "@/libs/helper";
import SupplierCard from "@/components/ui/SupplierCard";
import ReceiveItemModal from "../modals/ReceiveItemModal";
import ReceiveTransactionModal from "../modals/ReceiveTransactionModal";
import ReceiveCancelModal from "../modals/ReceiveCancelModal";

const EditReceiveInventorySchema = (receive: ReceiveInventoryDetail) => {
  return z.object({
    code: z
      .string()
      .min(1, { message: "Mã đơn nhập không để trống" })
      .refine(
        (code) => {
          if (code === receive.code) return true;
          return !code.toLowerCase().startsWith("re");
        },
        { message: "Mã đơn nhập không bắt đầu bằng RE" }
      ),
    expectedOn: z.date().optional(),
    note: z.string().optional(),
    deleteTags: z.array(z.string()),
    addTags: z.array(z.string()),
  });
};

type Props = {
  receiveInventory: ReceiveInventoryDetail;
};

const FormEditReceiveInventory = ({ receiveInventory }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [exitConfirm, setExitConfirm] = useState(false);
  const [openReceiveModal, setOpenReceiveModal] = useState(false);
  const [openTransactionModal, setOpenTransactionModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = useState(false);

  const router = useRouter();

  const schema = EditReceiveInventorySchema(receiveInventory);
  type EditReceiveInventoryField = z.infer<typeof schema>;

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, submitCount, isValid, isSubmitted, isDirty },
  } = useForm<EditReceiveInventoryField>({
    resolver: zodResolver(schema),
    defaultValues: {
      expectedOn: receiveInventory.expectedAt ?? undefined,
      note: receiveInventory.note ?? undefined,
      code: receiveInventory.code,
      addTags: [],
      deleteTags: [],
    },
  });

  const onSubmit: SubmitHandler<EditReceiveInventoryField> = async (data) => {
    try {
      setIsLoading(true);
      const session = await getSession();
      const res = await fetch(PUT_UPDATE_RECEIVE_INVENTORY, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          ...data,
          receiveId: receiveInventory.id,
        }),
      });
      setIsLoading(false);

      const response = await res.json();

      if (res.ok) {
        toast.success(response.message ?? "Cập nhật đơn nhập thành công");
        router.refresh();
        return;
      }

      throw new Error(response.message);
    } catch (error: any) {
      toast.error(error.message ?? "Đã xảy ra lỗi");
    }
  };

  const handleTagChange = useCallback((tags: string[]) => {
    const addedTags = tags.filter(
      (tag) => !receiveInventory.tags.find((receiveTag) => receiveTag === tag)
    );
    const deletedTags = receiveInventory.tags.filter(
      (tag) => !tags.find((pTag) => pTag === tag)
    );

    setValue("addTags", addedTags, {
      shouldDirty: true,
      shouldTouch: true,
    });

    setValue("deleteTags", deletedTags, {
      shouldDirty: true,
      shouldTouch: true,
    });
  }, []);

  const handleDelete = useCallback(async () => {
    try {
      const session = await getSession();
      const res = await fetch(DELETE_RECEIVE_INVENTORY(receiveInventory.id), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      const response = await res.json();
      if (res.ok) {
        toast.success(response.message ?? "Xóa đơn nhập thành công");
        router.push(ReceiveInventoryRoute);
        return;
      }
      throw new Error(response.message);
    } catch (error: any) {
      toast.error(error.message ?? "Đã xảy ra lỗi");
    }
  }, []);

  useEffect(() => {
    if (isSubmitted && !isValid) {
      if (Object.keys(errors).length > 0) {
        const firstErrorField = Object.keys(errors)[0];
        const firstErrorMessage =
          errors[firstErrorField as keyof typeof errors]?.message;
        const messageToDisplay =
          typeof firstErrorMessage === "string"
            ? firstErrorMessage
            : "Có thông tin không hợp lệ";

        // toast.error(`${firstErrorField}: ${messageToDisplay}`);
        toast.error(`${messageToDisplay}`);
      }
    }
  }, [submitCount]);

  return (
    <>
      <form
        className="flex gap-4 flex-wrap"
        id="EditReceiveInventoryForm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col flex-[4] gap-4 basis-[600px]">
          <GroupBox title="Sản phẩm">
            <div className="max-w-full overflow-y-auto max-h-[300px]">
              <Table removeWrapper isHeaderSticky>
                <TableHeader>
                  <TableColumn className="w-2/5">Sản phẩm</TableColumn>
                  <TableColumn className="w-28" align="center">
                    Số lượng
                  </TableColumn>
                  <TableColumn align="center">Đơn giá</TableColumn>
                  <TableColumn align="center">Thành tiền</TableColumn>
                </TableHeader>
                <TableBody
                  items={receiveInventory.items}
                  emptyContent={"Chưa chọn sản phẩm."}
                >
                  {(item) => (
                    <TableRow key={item.id}>
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
                        <Tooltip
                          showArrow
                          content={`Có thể nhập: ${item.quantityRemain}`}
                        >
                          <span>{`${item.quantityReceived}/${item.quantity}`}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-col items-center">
                          <span
                            className={cn("line-through text-gray-500", {
                              hidden: item.discountValue === 0,
                            })}
                          >
                            {CurrencyFormatter().format(item.price)}
                          </span>
                          <span>
                            {CurrencyFormatter().format(item.finalPrice)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {CurrencyFormatter().format(item.finalTotal)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex gap-4 justify-end">
              <RenderIf
                condition={
                  receiveInventory.status === ReceiveInventoryStatus.CANCEL
                }
              >
                <Button
                  color="danger"
                  radius="sm"
                  size="sm"
                  onClick={() => setOpenDeleteConfirmModal(true)}
                >
                  Xóa đơn nhập
                </Button>
              </RenderIf>
              <RenderIf
                condition={
                  receiveInventory.status !== ReceiveInventoryStatus.CANCEL
                }
              >
                <Button
                  color="danger"
                  radius="sm"
                  size="sm"
                  variant="light"
                  onClick={() => setOpenCancelModal(true)}
                >
                  Hủy đơn
                </Button>
              </RenderIf>
              <RenderIf
                condition={
                  receiveInventory.status !== ReceiveInventoryStatus.CANCEL &&
                  receiveInventory.status !== ReceiveInventoryStatus.RECEIVED
                }
              >
                <Button
                  color="primary"
                  radius="sm"
                  size="sm"
                  onClick={() => setOpenReceiveModal(true)}
                >
                  Nhập hàng
                </Button>
              </RenderIf>
            </div>
          </GroupBox>

          <GroupBox title="Thanh toán">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <span className="flex-1">Tổng tiền</span>
                <div className="flex-[3] flex justify-between">
                  <span>{receiveInventory.totalItems} sản phẩm</span>
                  <div className="flex gap-1">
                    <RenderIf
                      condition={receiveInventory.totalItemsDiscount > 0}
                    >
                      <span className="line-through text-gray-500">
                        {CurrencyFormatter().format(
                          receiveInventory.totalItemsPriceBeforeDiscount
                        )}
                      </span>
                    </RenderIf>
                    <span>
                      {CurrencyFormatter().format(
                        receiveInventory.totalItemsPrice
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="flex-1">Giảm giá</span>
                <div className="flex-[3] flex justify-between">
                  <span>-----</span>
                  <span>
                    {CurrencyFormatter().format(
                      receiveInventory.totalItemsDiscount * -1
                    )}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="flex-1">Chi phí nhập hàng</span>
                <div className="flex-[3] flex justify-between">
                  <div className="flex flex-col gap-2">
                    {receiveInventory.receiveLandedCosts.map((item) => (
                      <span key={item.id}>
                        {item.name}: {CurrencyFormatter().format(item.price)}
                      </span>
                    ))}
                  </div>
                  <span>
                    {CurrencyFormatter().format(
                      receiveInventory.totalLandedCost
                    )}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center font-semibold">
                <span>Đã thanh toán</span>
                <span>
                  {CurrencyFormatter().format(
                    receiveInventory.totalReceipt -
                      receiveInventory.transactionRemainAmount
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center font-semibold">
                <span>Tiền cần trả NCC</span>
                <span>
                  {CurrencyFormatter().format(
                    receiveInventory.transactionRemainAmount
                  )}
                </span>
              </div>
              <RenderIf
                condition={
                  receiveInventory.status !== ReceiveInventoryStatus.CANCEL &&
                  receiveInventory.transactionStatus !==
                    ReceiveInventoryTransaction.PAID
                }
              >
                <div className="flex justify-end">
                  <Button
                    color="primary"
                    radius="sm"
                    size="sm"
                    onClick={() => setOpenTransactionModal(true)}
                  >
                    Thanh toán
                  </Button>
                </div>
              </RenderIf>
            </div>
          </GroupBox>

          <GroupBox
            title="Lịch sử đơn nhập hàng"
            titleEndContent={
              <Link
                href={ReceiveInventoryImportHistoryRoute(receiveInventory.id)}
                target="_blank"
              >
                <span className="label-link">Lịch sử nhập kho</span>
              </Link>
            }
          >
            <div className="max-w-full overflow-y-auto max-h-[400px]">
              <Table
                removeWrapper
                isHeaderSticky
                classNames={{
                  td: "h-20",
                }}
              >
                <TableHeader>
                  <TableColumn>Thời gian</TableColumn>
                  <TableColumn align="center">Người thực hiện</TableColumn>
                  <TableColumn className="w-3/5">Hành động</TableColumn>
                </TableHeader>
                <TableBody items={receiveInventory.receiveHistories}>
                  {(item) => (
                    <TableRow
                      key={item.id}
                      className="border-b-1 border-gray-300"
                    >
                      <TableCell>
                        {convertDateToString(item.createdAt)}
                      </TableCell>
                      <TableCell>{item.changedUser.name}</TableCell>
                      <TableCell>
                        <RenderIf condition={item.action === "Thanh toán"}>
                          <Accordion
                            itemClasses={{
                              title: "text-sm",
                              titleWrapper: "p-0",
                            }}
                            className="p-0"
                          >
                            <AccordionItem title={item.action}>
                              <div className="flex gap-2 flex-col text-sm">
                                <div className="flex justify-between items-center">
                                  <span>Hình thức thanh toán:</span>
                                  <span>
                                    {item.receiveTransaction?.paymentMethod}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span>Ngày thanh toán:</span>
                                  <span>
                                    {item.receiveTransaction?.processedAt &&
                                      convertDateToString(
                                        item.receiveTransaction.processedAt
                                      )}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span>Số tiền thanh toán:</span>
                                  <span>
                                    {item.receiveTransaction?.amount &&
                                      CurrencyFormatter().format(
                                        item.receiveTransaction.amount
                                      )}
                                  </span>
                                </div>
                              </div>
                            </AccordionItem>
                          </Accordion>
                        </RenderIf>
                        <RenderIf condition={item.action !== "Thanh toán"}>
                          {item.action}
                        </RenderIf>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </GroupBox>
        </div>

        <div className="flex flex-col flex-[2] gap-4 basis-[300px]">
          <GroupBox title="Nhà cung cấp">
            <SupplierCard supplier={receiveInventory.supplier} />
          </GroupBox>

          <GroupBox title="Kho nhập">
            <Input
              isDisabled
              isReadOnly
              value={receiveInventory.warehouse.name}
              variant="bordered"
              radius="sm"
            />
          </GroupBox>

          <GroupBox title="Thông tin bổ sung">
            <div className="flex flex-col gap-4">
              <Input
                label="Mã đơn nhập"
                placeholder="Nhập mã đơn nhập"
                variant="bordered"
                radius="sm"
                labelPlacement="outside"
                isInvalid={errors.code ? true : false}
                errorMessage={errors.code?.message}
                {...register("code")}
              />

              <DatePicker
                label="Ngày nhập dự kiến"
                variant="bordered"
                radius="sm"
                labelPlacement="outside"
                hideTimeZone
                showMonthAndYearPickers
                minValue={today(getLocalTimeZone())}
                defaultValue={
                  receiveInventory.expectedAt
                    ? parseDateTime(
                        receiveInventory.expectedAt.toString().slice(0, -1)
                      )
                    : undefined
                }
                isDisabled={
                  receiveInventory.status !==
                  ReceiveInventoryStatus.NOT_RECEIVED
                }
                onChange={(dateValue) =>
                  setValue("expectedOn", dateValue.toDate(getLocalTimeZone()), {
                    shouldDirty: true,
                  })
                }
              />
            </div>
          </GroupBox>

          <GroupBox title="Ghi chú">
            <Textarea
              placeholder="Nhập ghi chú"
              variant="bordered"
              radius="sm"
              maxRows={5}
              minRows={3}
              {...register("note")}
            />
          </GroupBox>

          <TagSeletor
            type={TagType.RECEIVE_INVENTORY}
            onValueChange={(tags) => handleTagChange(tags)}
          />
        </div>
      </form>

      <Divider className="my-6" />

      <div className="flex justify-end gap-5">
        <Button
          radius="sm"
          variant="bordered"
          color="danger"
          onClick={
            isDirty
              ? () => setExitConfirm(true)
              : () => router.push(ReceiveInventoryRoute)
          }
          isDisabled={isLoading}
        >
          Hủy
        </Button>
        <Button
          radius="sm"
          color="primary"
          type="submit"
          form="EditReceiveInventoryForm"
          isDisabled={isLoading || !isDirty}
          isLoading={isLoading}
        >
          Lưu
        </Button>
      </div>

      <ConfirmModal
        cancelText="Không phải bây giờ"
        confirmText="Xác nhận"
        title="Chỉnh sửa chưa được lưu"
        isOpen={exitConfirm}
        onOpenChange={(open) => setExitConfirm(open)}
        onConfirm={() => {
          router.push(`${ReceiveInventoryRoute}`);
        }}
      >
        <span>
          Các thay đổi bạn đã thực hiện không được lưu. Bạn có muốn tiếp tục?
        </span>
      </ConfirmModal>

      {openReceiveModal && (
        <ReceiveItemModal
          isOpen={openReceiveModal}
          onOpenChange={(open) => setOpenReceiveModal(open)}
          receiveInventory={receiveInventory}
        />
      )}

      {openTransactionModal && (
        <ReceiveTransactionModal
          isOpen={openTransactionModal}
          onOpenChange={(open) => setOpenTransactionModal(open)}
          receiveInventory={receiveInventory}
        />
      )}

      {openCancelModal && (
        <ReceiveCancelModal
          isOpen={openCancelModal}
          onOpenChange={(open) => setOpenCancelModal(open)}
          receiveInventory={receiveInventory}
        />
      )}

      {openDeleteConfirmModal && (
        <ConfirmModal
          title="Xác nhận xóa đơn nhập"
          isOpen={openDeleteConfirmModal}
          onOpenChange={(open) => setOpenDeleteConfirmModal(open)}
          onConfirm={handleDelete}
          cancelText="Hủy"
          confirmText="Xóa đơn"
        >
          <span>
            Hành động này không thể hoàn tác. Xác nhận xóa đơn nhập{" "}
            <span className="font-medium">{receiveInventory.code}</span> ?
          </span>
        </ConfirmModal>
      )}
    </>
  );
};

export default FormEditReceiveInventory;
