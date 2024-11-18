import { getProduct } from "@/app/api/products";
import { ProductTable } from "@/components/specific/ProductTable";
import ErrorPage from "@/components/ui/ErrorPage";
import LinkButton from "@/components/ui/LinkButton";
import LoadingCard from "@/components/ui/Loading";
import PageTitle from "@/components/ui/PageTitle";
import { CreateProductRoute } from "@/constants/route";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";
import { QueryParams } from "@/libs/types/backend";
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
  const { searchParams } = props;
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
          Tạo đơn nhập hàng
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
};

export default Page;
