import GoBackButton from "@/components/ui/GoBackButton";
import LinkButton from "@/components/ui/LinkButton";
import LoadingCard from "@/components/ui/Loading";
import PageTitle from "@/components/ui/PageTitle";
import {
  CreateReceiveInventoryRoute,
  ReceiveInventoryRoute,
} from "@/constants/route";
import { Suspense } from "react";
import { FaPlus } from "react-icons/fa6";

type Props = {};
const Page = (props: Props) => {
  return (
    <div className="px-5">
      <div className="flex justify-between items-center">
        <PageTitle>Danh sách đơn nhập hàng </PageTitle>
        <LinkButton
          href={`${CreateReceiveInventoryRoute}`}
          buttonProps={{ startContent: <FaPlus size={18} /> }}
        >
          Tạo đơn nhập hàng
        </LinkButton>
      </div>
      <Suspense fallback={<LoadingCard />}>
        {/* <ProductTable
          products={data.products}
          total={data.paginition.total}
          count={data.paginition.count}
          page={page}
          limit={limit}
        /> */}
      </Suspense>
    </div>
  );
};
export default Page;
