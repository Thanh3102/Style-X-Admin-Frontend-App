import { GetCategories } from "@/app/api/categories";
import { GetCategoryResponse } from "@/app/api/categories/categories.type";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { RxTriangleDown } from "react-icons/rx";

const CategoryFilterButton = () => {
  const [categories, setCategories] = useState<GetCategoryResponse>([]);
  const [page, setPage] = useState(1);
  const limit = "1000";

  const fetchCategories = async () => {
    try {
      const categories = await GetCategories({
        page: page.toString(),
        limit: limit,
      });
      setCategories(categories);
    } catch (error) {
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Button
          disableRipple
          endContent={<RxTriangleDown size={16} className="text-gray-500" />}
        >
          Danh mục
        </Button>
      </PopoverTrigger>
      <PopoverContent>Content</PopoverContent>
    </Popover>
  );
};
export default CategoryFilterButton;
