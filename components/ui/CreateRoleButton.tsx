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
import { PermissionSection } from "../specific/RoleTab";
import FormCreateRole from "../specific/forms/FormCreateRole";
import RenderIf from "./RenderIf";

type Props = {
  fetchRoles: () => void;
  permissionSections: PermissionSection[];
};

const CreateRoleButton = ({ fetchRoles, permissionSections }: Props) => {
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        radius="sm"
        color="primary"
        startContent={<GoPlusCircle size={18} />}
        onClick={onOpen}
      >
        Thêm vai trò mới
      </Button>

      <RenderIf condition={isOpen}>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={true}>
          <ModalContent className="max-w-[50vw]">
            <ModalHeader>Thêm vai trò mới</ModalHeader>
            <ModalBody className="max-h-[60vh] overflow-y-auto">
              <FormCreateRole
                onClose={onClose}
                fetchRoles={fetchRoles}
                permissionSections={permissionSections}
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
                  form="FormCreateRole"
                >
                  Thêm
                </Button>
              </div>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </RenderIf>
    </>
  );
};
export default CreateRoleButton;
