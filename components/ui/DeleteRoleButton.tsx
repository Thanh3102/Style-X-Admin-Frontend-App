import { useDisclosure } from "@nextui-org/react";
import { FaTrash } from "react-icons/fa6";
import ConfirmModal from "../specific/ConfirmModal";
import { Role } from "../specific/RoleTab";
import toast from "react-hot-toast";
import { DELETE_ROLE_ROUTE } from "@/constants/api-routes";
import { getSession } from "next-auth/react";

type Props = {
  role: Role;
  fetchRoles: () => void;
};
const DeleteRoleButton = ({ role, fetchRoles }: Props) => {
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  const handleDelete = async () => {
    try {
      const session = await getSession();
      const res = await fetch(`${DELETE_ROLE_ROUTE}/${role.id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${session?.accessToken}`,
        },
      });

      const response = await res.json();
      if (res.ok) {
        toast.success(response.message ?? "Đã xóa vai trò");
        onClose();
        fetchRoles();
        return;
      }
      throw new Error(response.message);
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
        title="Xác nhận xóa vai trò"
        onConfirm={handleDelete}
      >
        <span>
          Bạn có chắc muốn xóa vai trò <strong>{role.name}</strong> ?
        </span>
        <span>Hành động này không thể hoàn tác</span>
      </ConfirmModal>
    </>
  );
};
export default DeleteRoleButton;
