import { getCurrentPermissions } from "@/app/api/customer";
import { getSupplier } from "@/app/api/suppliers";
import { auth } from "@/auth";
import { SupplierTable } from "@/components/specific/SupplierTable";
import AccessDeniedPage from "@/components/ui/AccessDeniedPage";
import ErrorPage from "@/components/ui/ErrorPage";
import LinkButton from "@/components/ui/LinkButton";
import PageTitle from "@/components/ui/PageTitle";
import { CreateSupplierRoute } from "@/constants/route";

import {
  FilterParam,
  QueryParams,
  SupplierPermission,
} from "@/libs/types/backend";

import { FaPlus } from "react-icons/fa6";

type Props = { searchParams: Promise<QueryParams> };

const getSupplierData = async (
  params: QueryParams,
  accessToken: string | undefined | null,
) => {
  try {
    const data = await getSupplier(accessToken, params);
    return { data };
  } catch (error) {
    return { error };
  }
};

const Page = async ({ searchParams: searchParamsPromise }: Props) => {
  try {
    const session = await auth();
    const permissions = await getCurrentPermissions(session?.accessToken);
    if (!permissions.includes(SupplierPermission.Access)) {
      return <AccessDeniedPage />;
    }

    const searchParams = await searchParamsPromise;
    const { data, error } = await getSupplierData(
      searchParams,
      session?.accessToken,
    );

    console.log(data);

    if (error || !data) return <ErrorPage />;

    return (
      <div className="px-10">
        <div className="flex justify-between items-center">
          <PageTitle>Danh sách nhà cung cấp</PageTitle>
          <LinkButton
            href={`${CreateSupplierRoute}`}
            buttonProps={{ startContent: <FaPlus size={18} /> }}
          >
            Thêm nhà cung cấp mới
          </LinkButton>
        </div>

        <SupplierTable
          suppliers={data.suppliers}
          total={data.paginition.total}
          count={data.paginition.count}
          page={Number(data.paginition.page) ?? 1}
          limit={Number(data.paginition.limit) ?? 20}
        />
      </div>
    );
  } catch (error) {
    return <ErrorPage />;
  }
};

export default Page;
