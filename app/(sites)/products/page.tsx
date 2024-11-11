import ProductTable from "@/components/specific/ProductTable";
import LoadingCard from "@/components/ui/Loading";
import PageTitle from "@/components/ui/PageTitle";
import { CreateProductRoute } from "@/constants/route";
import { Button, Link, Skeleton } from "@nextui-org/react";
import { Suspense } from "react";
import { FaPlus } from "react-icons/fa6";

const Page = async () => {
  // await new Promise((resolve) => setTimeout(resolve, 99000));
  return (
    <div className="px-5">
      <div className="flex justify-between">
        <PageTitle>Danh sách sản phẩm</PageTitle>
        <Link href={`${CreateProductRoute}`}>
          <Button
            color="primary"
            radius="sm"
            startContent={<FaPlus size={18} />}
            className="text-white"
          >
            Thêm sản phẩm
          </Button>
        </Link>
      </div>
      <Suspense fallback={<Skeleton isLoaded className="h-full w-full" />}>
        {/* <ProductTable /> */}
      </Suspense>
    </div>
  );
};

export default Page;
