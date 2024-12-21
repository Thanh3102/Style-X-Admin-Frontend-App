"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CreateEmployeeButton from "../ui/CreateEmployeeButton";
import LoadingPage from "../ui/LoadingPage";
import { EmployeeTable } from "./tables/EmployeeTable";
import { useSearchParams } from "next/navigation";
import { GetEmployeesResponse } from "@/app/api/employee/employee.type";
import { GetEmployees } from "@/app/api/employee";
import { getSession } from "next-auth/react";
import { Role } from "./RoleTab";
import { GET_ROLES_ROUTE } from "@/constants/api-routes";
import { Input } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import EmployeeSearch from "./search_selector/EmployeeSearch";

type Props = {
  employeeData: GetEmployeesResponse;
};

const EmployeeTab = ({ employeeData }: Props) => {

  const [roles, setRoles] = useState<Role[]>([]);

  const fetchRoles = useCallback(async () => {
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
  }, []);



  useEffect(() => {
    fetchRoles();
  }, []);



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
            roles={roles}
          />
        </div>
      </div>
    </>
  );
};
export default EmployeeTab;
