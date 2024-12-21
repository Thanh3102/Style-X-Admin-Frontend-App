import { Employee } from "@/app/api/employee/employee.type";
import FormUpdateUserInfo from "@/components/specific/forms/FormUpdateUserInfo";
import ErrorPage from "@/components/ui/ErrorPage";
import { GET_USER_INFO_ROUTE } from "@/constants/api-routes";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";
import { getServerSession } from "next-auth";

const GetUserInformation = async () => {
  const session = await getServerSession(nextAuthOptions);
  if (!session) {
    throw new Error("Session not found");
  }

  const res = await fetch(GET_USER_INFO_ROUTE, {
    method: "GET",
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });

  const response = await res.json();

  if (res.ok) {
    return response as Employee;
  }

  throw new Error(response.message);
};

const Page = async () => {
  try {
    const info = await GetUserInformation();
    return (
      <div className="px-20 py-5">
        <div className="flex p-5 bg-white rounded-lg shadow-md h-full">
          <div className="flex-1 flex flex-col">
            <span className="font-medium">Thông tin cá nhân</span>
            <span className="text-sm text-zinc-500">
              Các thông tin của tài khoản đang đăng nhập hệ thống
            </span>
          </div>
          <div className="flex-[2]">
            <FormUpdateUserInfo employee={info} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.log(error);
    return <ErrorPage />;
  }
};
export default Page;
