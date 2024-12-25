import { GetCollections } from "@/app/api/categories";
import { getCurrentPermissions } from "@/app/api/customer";
import { CollectionTable } from "@/components/specific/tables/CollectionTable";
import AccessDeniedPage from "@/components/ui/AccessDeniedPage";
import CreateCollectionButton from "@/components/ui/CreateCollectionButton";
import ErrorPage from "@/components/ui/ErrorPage";
import PageTitle from "@/components/ui/PageTitle";
import { nextAuthOptions } from "@/libs/nextauth/nextAuthOptions";
import { CategoryPermission, QueryParams } from "@/libs/types/backend";
import { getServerSession } from "next-auth";

const getCollectionData = async () => {
  try {
    const data = await GetCollections();
    return {
      collections: data,
    };
  } catch (error: any) {
    return { error: error.message };
  }
};

const Page = async () => {
  try {
    const session = await getServerSession(nextAuthOptions);
    const permissions = await getCurrentPermissions(session?.accessToken);
    if (!permissions.includes(CategoryPermission.Access))
      return <AccessDeniedPage />;

    const { collections, error } = await getCollectionData();
    if (error) throw new Error(error);

    return (
      <div className="px-10 mb-5">
        <div className="flex flex-wrap -mx-4 [&>*]:px-4 gap-y-8">
          <div className="flex-1 flex-col">
            <div className="flex justify-between items-center">
              <PageTitle>Danh sách bộ sưu tập</PageTitle>
              <div className="">
                {/* <span>Nút sắp xếp thứ tự</span> */}
                <CreateCollectionButton />
              </div>
            </div>
            {collections && <CollectionTable collections={collections} />}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.log(error);
    return <ErrorPage />;
  }
};
export default Page;
