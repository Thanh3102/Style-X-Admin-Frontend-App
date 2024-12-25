"use client";
import { Tabs, Tab } from "@nextui-org/tabs";
import { FaUserTie } from "react-icons/fa6";
import { GoShieldLock } from "react-icons/go";
import EmployeeTab from "./EmployeeTabs";
import RoleTab from "./RoleTab";
import { GetEmployeesResponse } from "@/app/api/employee/employee.type";
import { EmployeePermission, RolePermission } from "@/libs/types/backend";
import AccessDeniedPage from "../ui/AccessDeniedPage";

type Props = {
  employeeData: GetEmployeesResponse;
  permissions: string[];
};

const EmployeePageTabs = ({ employeeData, permissions }: Props) => {
  const tabs = [
    {
      id: "employees",
      label: "Nhân viên",
      icon: <FaUserTie size={20} />,
      content: <EmployeeTab employeeData={employeeData} />,
      renderIf: permissions.includes(EmployeePermission.Access),
    },
    {
      id: "roles",
      label: "Vai trò",
      icon: <GoShieldLock size={20} />,
      content: <RoleTab />,
      renderIf: permissions.includes(RolePermission.Access),
    },
  ];

  const renderTabs = tabs.filter((tab) => tab.renderIf);

  if (renderTabs.length === 0) return <AccessDeniedPage />;

  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Employee page tabs"
        items={renderTabs}
        radius="sm"
        variant="light"
        size="lg"
      >
        {(item) => (
          <Tab
            key={item.id}
            title={
              <div className="flex items-center space-x-2">
                {item.icon}
                <span>{item.label}</span>
              </div>
            }
          >
            {item.content}
          </Tab>
        )}
      </Tabs>
    </div>
  );
};
export default EmployeePageTabs;
