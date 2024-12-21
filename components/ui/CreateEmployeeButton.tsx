import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { GoPlusCircle } from "react-icons/go";
import { PermissionSection, Role } from "../specific/RoleTab";
import FormCreateRole from "../specific/forms/FormCreateRole";
import FormCreateEmployee from "../specific/forms/FormCreateEmployee";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { GET_ROLES_ROUTE } from "@/constants/api-routes";

const CreateEmployeeButton = () => {
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  const [roles, setRoles] = useState<Role[]>([]);

  const fetchRoles = async () => {
    try {
      const session = await getSession();
      const res = await fetch(GET_ROLES_ROUTE, {
        headers: {
          authorization: `Bearer ${session?.accessToken}`,
        },
        cache: "no-store",
      });
      const response = await res.json();

      if (res.ok) {
        setRoles(response as Role[]);
      }
    } catch (error: any) {
      setRoles([]);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <>
      <Button
        radius="sm"
        color="primary"
        startContent={<GoPlusCircle size={18} />}
        onClick={onOpen}
      >
        Thêm nhân viên
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={true}>
        <ModalContent className="max-w-[50vw]">
          <ModalHeader>Thêm nhân viên</ModalHeader>
          <ModalBody className="max-h-[60vh] overflow-y-auto">
            <FormCreateEmployee roles={roles} onClose={onClose} />
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
                form="FormCreateEmployee"
              >
                Thêm
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateEmployeeButton;
