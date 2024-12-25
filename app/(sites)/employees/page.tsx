import { getCurrentPermissions } from "@/app/api/customer";
import { GetEmployees } from "@/app/api/employee";
import EmployeePageTabs from "@/components/specific/EmployeePageTabs";
import ErrorPage from "@/components/ui/ErrorPage";
import LoadingPage from "@/components/ui/LoadingPage";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";
import { QueryParams } from "@/libs/types/backend";
import { AuthOptions, getServerSession } from "next-auth";
import { Suspense } from "react";

type Props = {
  searchParams: QueryParams;
};

const Page = async ({ searchParams }: Props) => {
  try {
    const session = await getServerSession(nextAuthOptions);
    const permissions = await getCurrentPermissions(session?.accessToken);
    const employeeData = await GetEmployees(searchParams, session?.accessToken);
    return (
      <div className="px-10 py-5">
        <Suspense fallback={<LoadingPage />}>
          <EmployeePageTabs
            employeeData={employeeData}
            permissions={permissions}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.log(error);
    return <ErrorPage />;
  }
};
export default Page;
