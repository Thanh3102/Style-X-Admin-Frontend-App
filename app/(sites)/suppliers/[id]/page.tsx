import GoBackButton from "@/components/ui/GoBackButton";
import PageTitle from "@/components/ui/PageTitle";
import { SupplierInfo } from "@/components/specific/SupplierInfo";
import { SupplierOrdersPanel } from "@/components/specific/SupplierOrdersPanel";
import { Status } from "@/components/ui/Status";
import {
  GET_SUPPLIER_DETAIL_ROUTE,
  GET_SUPPLIER_ROUTE,
} from "@/constants/api-routes";
import { SuppliersRoute } from "@/constants/route";
import { DetailSuppler, SupplierPermission } from "@/libs/types/backend";
import { Suspense } from "react";
import LoadingCard from "@/components/ui/LoadingCard";
import { getCurrentPermissions } from "@/app/api/customer";
import AccessDeniedPage from "@/components/ui/AccessDeniedPage";
import ErrorPage from "@/components/ui/ErrorPage";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const getSupplier = async (
  id: string,
): Promise<{
  supplier: DetailSuppler | null;
  error?: string;
  statusCode?: number;
}> => {
  try {
    const session = await auth();
    const res = await fetch(`${GET_SUPPLIER_DETAIL_ROUTE}/${id}`, {
      headers: {
        authorization: `Bearer ${session?.accessToken}`,
      },
    });

    const statusCode = res.status;
    const data = await res.json();

    if (statusCode === 404) {
      return {
        supplier: null,
        error: data.error || data.message || "",
        statusCode: 404,
      };
    }

    if (res.ok) {
      return {
        supplier: data,
      };
    }

    throw new Error(data.error || data.message || "Failed to get supplier");
  } catch (error: any) {
    console.error(error);

    return {
      supplier: null,
      error: error?.message || "An error occurred",
    };
  }
};

const Page = async ({ params: paramsPromise }: Props) => {
  const session = await auth();
  const permissions = await getCurrentPermissions(session?.accessToken);
  if (!permissions.includes(SupplierPermission.Access)) {
    return <AccessDeniedPage />;
  }

  const { id } = await paramsPromise;

  const { supplier, error, statusCode } = await getSupplier(id);

  if (statusCode === 404) {
    redirect("/suppliers", "replace");
  }

  if (error || !supplier) return <ErrorPage error={error} />;

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
      <Suspense fallback={<LoadingCard />}>
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
