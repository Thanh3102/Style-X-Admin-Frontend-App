import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { FaEdit } from "react-icons/fa";
import FormUpdateEmployee from "../specific/forms/FormUpdateEmployee";
import { Employee } from "@/app/api/employee/employee.type";
import { Role } from "../specific/RoleTab";

type Props = {
  employee: Employee;
  roles: Role[];
};
const UpdateEmployeeButton = ({ employee, roles }: Props) => {
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
          <ModalHeader>Cập nhật thông tin</ModalHeader>
          <ModalBody className="max-h-[60vh] overflow-y-auto">
            <FormUpdateEmployee
              employee={employee}
              roles={roles}
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
                form="FormUpdateEmployee"
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
export default UpdateEmployeeButton;
