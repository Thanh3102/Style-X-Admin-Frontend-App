"use client";

import CreateEmployeeButton from "../ui/CreateEmployeeButton";
import { EmployeeTable } from "./tables/EmployeeTable";
import { GetEmployeesResponse } from "@/app/api/employee/employee.type";
import EmployeeSearch from "./search_selector/EmployeeSearch";

type Props = {
  employeeData: GetEmployeesResponse;
};

const EmployeeTab = ({ employeeData }: Props) => {
  return (
    <>
      <div className="flex justify-end">
        <CreateEmployeeButton />
      </div>
      <div className="mt-2">
        <EmployeeSearch />
        <div className="">
          <EmployeeTable
            count={employeeData.paginition.count}
            limit={employeeData.paginition.limit}
            page={employeeData.paginition.page}
            total={employeeData.paginition.total}
            employees={employeeData.employees}
          />
        </div>
      </div>
    </>
  );
};
export default EmployeeTab;
