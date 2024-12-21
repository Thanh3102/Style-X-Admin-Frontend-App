import { useDisclosure } from "@nextui-org/react";
import { FaTrash } from "react-icons/fa6";
import ConfirmModal from "../specific/ConfirmModal";
import toast from "react-hot-toast";
import { getSession } from "next-auth/react";
import { Employee } from "@/app/api/employee/employee.type";
import { DeleteEmployee } from "@/app/api/employee";
import { useRouter } from "next/navigation";

type Props = {
  employee: Employee;
};
const DeleteEmployeeButton = ({ employee }: Props) => {
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const handleDelete = async () => {
    try {
      const session = await getSession();
      await DeleteEmployee(employee.id, session?.accessToken);
      router.refresh();
      onClose();
    } catch (error: any) {
      toast.error(error.message ?? "Đã xảy ra lỗi");
    }
  };

  return (
    <>
      <FaTrash
        size={20}
        className="hover:cursor-pointer hover:text-red-500"
        onClick={onOpen}
      />

      <ConfirmModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Xác nhận xóa nhân viên"
        onConfirm={handleDelete}
      >
        <span>
          Bạn có chắc muốn xóa nhân viên {employee.name}{" "}
          <strong>({employee.code})</strong> ?
        </span>
        <span>Hành động này không thể hoàn tác</span>
      </ConfirmModal>
    </>
  );
};
export default DeleteEmployeeButton;
