import { SupplierTable } from "@/components/specific/SupplierTable";
import PageTitle from "@/components/ui/PageTitle";
import { GET_SUPPLIER_ROUTE } from "@/constants/api-routes";
import { CreateSupplierRoute } from "@/constants/route";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";
import { FilterParam } from "@/libs/types/backend";
import { GetSupplierResponse } from "@/libs/types/backend/response";
import { Button } from "@nextui-org/react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { FiPlusCircle } from "react-icons/fi";

type GetSupplierParams = Partial<Record<FilterParam, any>>;

const getSupplier = async (params: GetSupplierParams) => {
  const {
    page = 1,
    limit = 20,
    query = "",
    createdOn = "",
    createdOnMin = "",
    createdOnMax = "",
    assignIds = "",
  } = params;
  try {
    const session = await getServerSession(nextAuthOptions);

    const res = await fetch(
      `${GET_SUPPLIER_ROUTE}?` +
        `${query ? `${FilterParam.QUERY}=${query}` : ""}` +
        `&${FilterParam.PAGE}=${page}` +
        `&${FilterParam.LIMIT}=${limit}` +
        `${createdOn ? `&${FilterParam.CREATED_ON}=${createdOn}` : ""}` +
        `${
          createdOnMin ? `&${FilterParam.CREATED_ON_MIN}=${createdOnMin}` : ""
        }` +
        `${
          createdOnMax ? `&${FilterParam.CREATED_ON_MAX}=${createdOnMax}` : ""
        }` +
        `${assignIds ? `&${FilterParam.ASSIGN_IDS}=${assignIds}` : ""}`,
      {
        headers: {
          authorization: `Bearer ${session?.accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (res.ok) {
      const data = (await res.json()) as GetSupplierResponse;
      return data;
    }

    const data = await res.json();

    return null;
  } catch (error) {
    console.log(`[Fetch Error]`, error);
    return null;
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

  const data = await getSupplier({
    page: pageNumber,
    limit: limitNumber,
    ...otherParams,
  });

  if (!data) return <>Error</>;

  return (
    <div className="px-10">
      <div className="flex justify-between items-center">
        <PageTitle>Danh sách nhà cung cấp</PageTitle>
        <Link href={CreateSupplierRoute}>
          <Button
            radius="sm"
            color="primary"
            startContent={<FiPlusCircle size={20} />}
            className="font-semibold"
          >
            Thêm nhà cung cấp
          </Button>
        </Link>
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
