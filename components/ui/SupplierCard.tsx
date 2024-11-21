import { SupplierResponse } from "@/app/api/suppliers/suppliers.type";
import { SupplierDetailRoute, SuppliersRoute } from "@/constants/route";
import { cn } from "@/libs/utils";
import { Avatar } from "@nextui-org/react";
import Link from "next/link";
import { FaX } from "react-icons/fa6";

type Props = {
  supplier: SupplierResponse;
  showCloseButton?: boolean;
  className?: string;
  onClose?: () => void;
};
const SupplierCard = ({
  supplier,
  className,
  showCloseButton = false,
  onClose,
}: Props) => {
  return (
    <div className={cn("bg-gray-100 p-4 rounded-md max-w-full", className)}>
      <div className="flex gap-2 items-center">
        <Avatar showFallback />
        <Link href={`${SupplierDetailRoute(supplier.id)}`}>
          <span className="label-link">{supplier.name}</span>
        </Link>
        {showCloseButton ? (
          <div
            className="p-1 rounded-full hover:bg-gray-100 hover:cursor-pointer"
            onClick={onClose}
          >
            <FaX />
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="flex flex-col gap-1 text-sm text-gray-500 mt-4">
        <span className="line-clamp-1">
          {supplier.code
            ? `Mã nhà cung cấp: ${supplier.code}`
            : "Không có mã nhà cung cấp"}
        </span>
        <span className="line-clamp-1">
          {supplier.phoneNumber
            ? `Số điện thoại: ${supplier.phoneNumber}`
            : "Không có số điện thoại"}
        </span>
        <span className="line-clamp-1">
          {supplier.email ? `Email: ${supplier.email}` : "Không có email"}
        </span>
      </div>
    </div>
  );
};
export default SupplierCard;
