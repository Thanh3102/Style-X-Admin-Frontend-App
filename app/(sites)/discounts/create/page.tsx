import { getCurrentPermissions } from "@/app/api/customer";
import FormCreateDiscount from "@/components/specific/forms/FormCreateDiscount";
import AccessDeniedPage from "@/components/ui/AccessDeniedPage";
import ErrorPage from "@/components/ui/ErrorPage";
import GoBackButton from "@/components/ui/GoBackButton";
import PageTitle from "@/components/ui/PageTitle";
import { DiscountsRoute } from "@/constants/route";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";
import { DiscountPermission } from "@/libs/types/backend";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type Props = {
  searchParams: { type: string | undefined };
};
const Page = async ({ searchParams }: Props) => {
  try {
    const acceptTypes = ["order", "product"];

    if (!searchParams.type || !acceptTypes.includes(searchParams.type)) {
      redirect(DiscountsRoute);
    }

    const session = await getServerSession(nextAuthOptions);
    const permissions = await getCurrentPermissions(session?.accessToken);
    if (!permissions.includes(DiscountPermission.Create)) {
      return <AccessDeniedPage />;
    }

    const textMap: any = {
      order: "đơn hàng",
      product: "sản phẩm",
    };

    return (
      <div className="px-14 mb-5">
        <div className="flex gap-4 items-center">
          <GoBackButton href={`${DiscountsRoute}`} />
          <PageTitle>
            Thêm mới mã giảm giá {textMap[searchParams.type]}
          </PageTitle>
        </div>
        <FormCreateDiscount
          type={searchParams.type as "order" | "product"}
          mode="coupon"
        />
      </div>
    );
  } catch (error) {
    return <ErrorPage />;
  }
};
export default Page;
