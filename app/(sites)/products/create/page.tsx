import FormCreateProduct from "@/components/specific/forms/FormCreateProduct";
import Breadcrumbs, { BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import GoBackButton from "@/components/ui/GoBackButton";
import LoadingCard from "@/components/ui/LoadingCard";
import PageTitle from "@/components/ui/PageTitle";
import { ProductRoute } from "@/constants/route";
import { Suspense } from "react";

const Page = () => {
  return (
    <div className="px-28">
      <div className="flex gap-4 items-center">
        <GoBackButton href={`${ProductRoute}`} />
        <PageTitle>Thêm sản phẩm</PageTitle>
      </div>
      <Suspense fallback={<LoadingCard />}>
        <FormCreateProduct />
      </Suspense>
    </div>
  );
};

export default Page;
