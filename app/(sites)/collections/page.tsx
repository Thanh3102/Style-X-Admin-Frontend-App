import { GetCategories, GetCollections } from "@/app/api/categories";
import { CategoryTable } from "@/components/specific/tables/CategoryTable";
import { CollectionTable } from "@/components/specific/tables/CollectionTable";
import CreateCategoryButton from "@/components/ui/CreateCategoryButton";
import CreateCollectionButton from "@/components/ui/CreateCollectionButton";
import ErrorPage from "@/components/ui/ErrorPage";
import PageTitle from "@/components/ui/PageTitle";
import { QueryParams } from "@/libs/types/backend";

// const getCategoryData = async (params: QueryParams) => {
//   try {
//     const data = await GetCategories(params);
//     return {
//       categories: data,
//     };
//   } catch (error: any) {
//     return { error: error.message };
//   }
// };

const getCollectionData = async () => {
    try {
      const data = await GetCollections();
      return {
        collections: data,
      };
    } catch (error: any) {
      return { error: error.message };
    }
}

type Props = {
  searchParams: QueryParams;
};

const Page = async ({ searchParams }: Props) => {
  // const { categories, error } = await getCategoryData(searchParams);

  const {collections, error} = await getCollectionData()
  // if (error) {
  //   console.log(error);
  //   return <ErrorPage />;
  // }

  return (
    <div className="px-10 mb-5">
      <div className="flex flex-wrap -mx-4 [&>*]:px-4 gap-y-8">
        {/* <div className="flex-1 flex-col">
          <div className="flex justify-between items-center">
            <PageTitle>Danh sách danh mục</PageTitle>
            <CreateCategoryButton />
          </div>
          {categories && <CategoryTable categories={categories} />}
        </div> */}
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
};
export default Page;
