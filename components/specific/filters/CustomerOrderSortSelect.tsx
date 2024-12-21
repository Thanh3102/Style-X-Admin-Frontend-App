"use client";

import { FilterParam } from "@/libs/types/backend";
import { Select, SelectItem } from "@nextui-org/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const sortOptions = [
  { key: "latest", label: "Gần nhất" },
  { key: "ascending", label: "Giá trị tăng dần" },
  { key: "descending", label: "Giá trị giảm dần" },
];

const CustomerOrderSortSelect = () => {
  const search = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSelectionChange = (key: string) => {
    const newSearch = new URLSearchParams(search.toString());
    newSearch.set(FilterParam.SORTBY, key);
    router.replace(`${pathname}?${newSearch.toString()}`);
  };

  return (
    <div className="w-1/3">
      <Select
        label="Sắp xếp"
        defaultSelectedKeys={[search.get(FilterParam.SORTBY) ?? ""]}
        onSelectionChange={(key) =>
          handleSelectionChange(Array.from(key)[0] as string)
        }
        disallowEmptySelection
      >
        {sortOptions.map((option) => (
          <SelectItem key={option.key} value={option.key}>
            {option.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};
export default CustomerOrderSortSelect;
