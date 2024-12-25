import { getCurrentPermissions } from "@/app/api/customer";
import { getProduct } from "@/app/api/products";
import { ProductTable } from "@/components/specific/ProductTable";
import AccessDeniedPage from "@/components/ui/AccessDeniedPage";
import ErrorPage from "@/components/ui/ErrorPage";
import LinkButton from "@/components/ui/LinkButton";
import LoadingCard from "@/components/ui/LoadingCard";
import PageTitle from "@/components/ui/PageTitle";
import { CreateProductRoute } from "@/constants/route";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";
import { ProductPermission, QueryParams } from "@/libs/types/backend";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import { FaPlus } from "react-icons/fa6";

type Props = {
  params: { slug: string };
  searchParams: QueryParams;
};

const getProductData = async (searchParams: QueryParams) => {
  try {
    const session = await getServerSession(nextAuthOptions);
    const data = await getProduct(session?.accessToken, searchParams);
    return { data };
  } catch (error) {
    return {
      error,
    };
  }
};

const Page = async (props: Props) => {
  try {
    const { searchParams } = props;

    const session = await getServerSession(nextAuthOptions);
    const permissions = await getCurrentPermissions(session?.accessToken);

    if (!permissions.includes(ProductPermission.Access))
      return <AccessDeniedPage />;

    const { data, error } = await getProductData(searchParams);

    if (error || !data) return <ErrorPage />;

    return (
      <div className="px-5">
        <div className="flex justify-between items-center">
          <PageTitle>Danh sách sản phẩm</PageTitle>
          <LinkButton
            href={`${CreateProductRoute}`}
            buttonProps={{ startContent: <FaPlus size={18} /> }}
          >
            Thêm sản phẩm mới
          </LinkButton>
        </div>
        <Suspense fallback={<LoadingCard />}>
          <ProductTable
            products={data.products}
            total={data.paginition.total}
            count={data.paginition.count}
            page={data.paginition.page}
            limit={data.paginition.limit}
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
