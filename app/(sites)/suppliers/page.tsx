import { getSupplier } from "@/app/api/suppliers";
import { SupplierTable } from "@/components/specific/SupplierTable";
import ErrorPage from "@/components/ui/ErrorPage";
import LinkButton from "@/components/ui/LinkButton";
import PageTitle from "@/components/ui/PageTitle";
import { GET_SUPPLIER_ROUTE } from "@/constants/api-routes";
import { CreateSupplierRoute } from "@/constants/route";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";
import { FilterParam } from "@/libs/types/backend";
import { getServerSession } from "next-auth";
import { FaPlus } from "react-icons/fa6";

type GetSupplierParams = Partial<Record<FilterParam, any>>;

const getSupplierData = async (params: GetSupplierParams) => {
  try {
    const session = await getServerSession(nextAuthOptions);

    const data = await getSupplier(session?.accessToken, params);

    return { data };
  } catch (error) {
    return { error };
  }
};

const Page = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: Partial<Record<FilterParam, string | undefined>>;
}) => {
  const { page, limit, ...otherParams } = searchParams;
  let pageNumber = 1;
  let limitNumber = 20;

  if (!isNaN(Number(page)) && Number(page) > 0) pageNumber = Number(page);

  if (!isNaN(Number(limit)) && Number(limit) > 0) limitNumber = Number(limit);

  const { data, error } = await getSupplierData({
    page: pageNumber,
    limit: limitNumber,
    ...otherParams,
  });

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
        page={pageNumber}
        limit={limitNumber}
      />
    </div>
  );
};

export default Page;
