import { getCurrentPermissions } from "@/app/api/customer";
import { GetDiscountDetail } from "@/app/api/discount";
import FormEditDiscount from "@/components/specific/forms/FormEditDiscount";
import AccessDeniedPage from "@/components/ui/AccessDeniedPage";
import ActiveDiscountButton from "@/components/ui/ActiveDiscountButton";
import DeleteDiscountButton from "@/components/ui/DeleteDiscountButton";
import ErrorPage from "@/components/ui/ErrorPage";
import GoBackButton from "@/components/ui/GoBackButton";
import PageTitle from "@/components/ui/PageTitle";
import RedirectToast from "@/components/ui/RedirectToast";
import { Status } from "@/components/ui/Status";
import { DiscountsRoute } from "@/constants/route";
import { isInteger } from "@/libs/helper";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";
import { DiscountPermission } from "@/libs/types/backend";
import { getServerSession } from "next-auth";

type Props = {
  params: { id: string };
};

const getDiscountDetail = async (id: string) => {
  if (!isInteger(id)) return { error: "Khuyến mại không tồn tại" };
  try {
    const session = await getServerSession(nextAuthOptions);
    const data = await GetDiscountDetail(parseInt(id), session?.accessToken);
    return { data };
  } catch (error: any) {
    return { error: error.message ?? "Đã xảy ra lỗi" };
  }
};

const Page = async ({ params }: Props) => {
  try {
    const session = await getServerSession(nextAuthOptions);
    const permissions = await getCurrentPermissions(session?.accessToken);
    if (!permissions.includes(DiscountPermission.Access)) {
      return <AccessDeniedPage />;
    }
    const { data, error } = await getDiscountDetail(params.id);

    if (error) return <RedirectToast href={DiscountsRoute} content={error} type="error"/>;

    if (!data) return <ErrorPage />;

    return (
      <div className="px-28 mb-5">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <GoBackButton href={`${DiscountsRoute}`} />
            <PageTitle className="text-base line-clamp-1">
              {data.title}
            </PageTitle>
            {data.active ? (
              <Status color="success" content="Đang áp dụng" />
            ) : (
              <Status content="Chưa kích hoạt" />
            )}
          </div>
          <div className="flex gap-2">
            <DeleteDiscountButton discountId={data.id} />
            <ActiveDiscountButton discountId={data.id} active={data.active} />
          </div>
        </div>

        <FormEditDiscount discount={data} />
      </div>
    );
  } catch (error) {
    return <ErrorPage />;
  }
};
export default Page;
