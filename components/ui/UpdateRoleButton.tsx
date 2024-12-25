"use client";

import { FaEdit } from "react-icons/fa";
import { PermissionSection, Role } from "../specific/RoleTab";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import FormUpdateRole from "../specific/forms/FormUpdateRole";

type Props = {
  role: Role;
  permissionSections: PermissionSection[];
  fetchRoles: () => void;
};

const UpdateRoleButton = ({ role, permissionSections, fetchRoles }: Props) => {
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  return (
    <>
      <FaEdit
        size={20}
        className="hover:cursor-pointer hover:text-blue-500"
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={true}>
        <ModalContent className="max-w-[50vw]">
          <ModalHeader>Cập nhật quyền hạn</ModalHeader>
          <ModalBody className="max-h-[60vh] overflow-y-auto">
            <FormUpdateRole
              fetchRoles={fetchRoles}
              role={role}
              permissionSections={permissionSections}
              onClose={onClose}
            />
          </ModalBody>
          <ModalFooter>
            <div className="flex gap-4">
              <Button
                radius="sm"
                variant="bordered"
                color="primary"
                onClick={onClose}
              >
                Hủy
              </Button>
              <Button
                radius="sm"
                color="primary"
                type="submit"
                form="FormUpdateRole"
              >
                Lưu
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default UpdateRoleButton;
