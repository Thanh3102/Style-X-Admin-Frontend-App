import GoBackButton from "@/components/ui/GoBackButton";
import PageTitle from "@/components/ui/PageTitle";
import { SupplierInfo } from "@/components/specific/SupplierInfo";
import { SupplierOrdersPanel } from "@/components/specific/SupplierOrdersPanel";
import { Status } from "@/components/ui/Status";
import { GET_SUPPLIER_DETAIL_ROUTE } from "@/constants/api-routes";
import { SuppliersRoute } from "@/constants/route";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";
import { DetailSuppler } from "@/libs/types/backend";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import LoadingCard from "@/components/ui/Loading";

type Props = {
  params: {
    id: string;
  };
};

const getSupplier = async (id: string) => {
  try {
    const session = await getServerSession(nextAuthOptions);    
    const res = await fetch(`${GET_SUPPLIER_DETAIL_ROUTE}/${id}`, {
      headers: {
        authorization: `Bearer ${session?.accessToken}`,
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (res.ok) {
      return {
        supplier: data as DetailSuppler,
      };
    }

    return {
      supplier: null,
      error: data.error,
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

const Page = async ({ params: { id } }: Props) => {
  const { supplier, error } = await getSupplier(id);

  if (error) {
    console.log("[Supplier/:id - Error]", error);
    redirect(`${SuppliersRoute}`);
  }

  if (!supplier) return <></>;

  return (
    <div className="px-16">
      <div className="flex gap-4 items-center">
        <GoBackButton href={SuppliersRoute} />
        <PageTitle>{supplier.name}</PageTitle>
        <Status
          content={`${supplier.active ? "Đang hoạt động" : "Ngừng hoạt động"}`}
          color={`${supplier.active ? "success" : "default"}`}
        />
      </div>
      <Suspense fallback={<LoadingCard/>}>
        <div className="flex gap-5">
          <div className="flex-[2] min-w-[500px]">
            <SupplierOrdersPanel supplier={supplier} />
          </div>
          <div className="flex-1 min-w-[250px]">
            <SupplierInfo supplier={supplier} />
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default Page;
