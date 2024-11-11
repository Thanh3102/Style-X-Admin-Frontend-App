import FormCreateSupplier from "@/components/specific/FormCreateSupplier";
import GoBackButton from "@/components/ui/GoBackButton";
import LoadingCard from "@/components/ui/Loading";
import PageTitle from "@/components/ui/PageTitle";
import { SuppliersRoute } from "@/constants/route";
import { Suspense } from "react";

const Page = () => {
  return (
    <div className="px-32">
      <div className="flex gap-4 items-center">
        <GoBackButton href={SuppliersRoute} />
        <PageTitle>Thêm mới nhà cung cấp</PageTitle>
      </div>
      <Suspense fallback={<LoadingCard />}>
        <FormCreateSupplier />
      </Suspense>
    </div>
  );
};

export default Page;
