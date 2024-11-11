export type Category = {
  id: number;
  title: string;
  slug: string;
  parentCategory: {
    id: number;
    title: string;
  } | null;
  // parentCategoryId: string;
  // childCategory: Category[];
};


