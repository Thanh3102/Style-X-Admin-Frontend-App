"use client";
import { Tabs, Tab } from "@nextui-org/tabs";
import { FaUserTie } from "react-icons/fa6";
import { GoShieldLock } from "react-icons/go";
import EmployeeTab from "./EmployeeTabs";
import RoleTab from "./RoleTab";
import { GetEmployeesResponse } from "@/app/api/employee/employee.type";

type Props = {
  employeeData: GetEmployeesResponse;
};

const EmployeePageTabs = ({ employeeData }: Props) => {
  let tabs = [
    {
      id: "employees",
      label: "Nhân viên",
      icon: <FaUserTie size={20} />,
      content: <EmployeeTab employeeData={employeeData} />,
    },
    {
      id: "roles",
      label: "Vai trò",
      icon: <GoShieldLock size={20} />,
      content: <RoleTab />,
    },
  ];

  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Employee page tabs"
        items={tabs}
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
