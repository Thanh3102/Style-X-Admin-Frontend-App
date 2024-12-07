export type GetCategoryResponse = {
  title: string;
  id: number;
  slug: string;
  image: string;
}[];

export type GetCollectionResponse = {
  id: number;
  title: string;
  slug: string;
  categories: {
    id: number;
    title: string;
    slug: string;
    image: string;
  }[];
}[];
