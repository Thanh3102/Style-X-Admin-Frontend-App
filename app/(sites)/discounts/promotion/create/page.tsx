import FormCreateDiscount from "@/components/specific/forms/FormCreateDiscount";
import GoBackButton from "@/components/ui/GoBackButton";
import PageTitle from "@/components/ui/PageTitle";
import RenderIf from "@/components/ui/RenderIf";
import { DiscountsRoute } from "@/constants/route";
import { redirect } from "next/navigation";

type Props = {
  searchParams: { type: string | undefined };
};

const textMap: any = {
  order: "đơn hàng",
  product: "sản phẩm",
};

const Page = ({ searchParams }: Props) => {
  const acceptTypes = ["order", "product"];

  if (!searchParams.type || !acceptTypes.includes(searchParams.type)) {
    redirect(DiscountsRoute);
  }
  return (
    <div className="px-14 mb-5">
      <div className="flex gap-4 items-center">
        <GoBackButton href={`${DiscountsRoute}`} />
        <PageTitle>
          Thêm mới chương trình khuyến mại {textMap[searchParams.type]}
        </PageTitle>
      </div>
      <FormCreateDiscount
        type={searchParams.type as "order" | "product"}
        mode="promotion"
      />
    </div>
  );
};
export default Page;
