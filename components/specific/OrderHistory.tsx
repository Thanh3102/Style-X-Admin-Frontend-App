"use client";
import { FormatOrderDetail } from "@/app/api/order/order.type";
import { GroupBox } from "../ui/GroupBox";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { convertDateToString } from "@/libs/helper";

type Props = {
  histories: FormatOrderDetail["histories"];
};
const OrderHistory = ({ histories }: Props) => {
  return (
    <GroupBox title="Lịch sử đơn hàng">
      <div className="max-w-full overflow-y-auto max-h-[400px]">
        <Table
          removeWrapper
          isHeaderSticky
          classNames={{
            td: "h-20",
          }}
        >
          <TableHeader>
            <TableColumn className="w-3/12">Thời gian</TableColumn>
            <TableColumn align="center" className="w-3/12">
              Người thực hiện
            </TableColumn>
            <TableColumn className="w-3/12">Hành động</TableColumn>
            <TableColumn className="w-3/12">Lý do</TableColumn>
          </TableHeader>
          <TableBody items={histories}>
            {(item) => (
              <TableRow key={item.id} className="border-b-1 border-gray-300">
                <TableCell>{convertDateToString(item.createdAt)}</TableCell>
                <TableCell>
                  {item.changedEmployee ? item.changedEmployee.name : "---"}
                </TableCell>
                <TableCell>{item.action}</TableCell>
                <TableCell>{item.reason}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </GroupBox>
  );
};
export default OrderHistory;
