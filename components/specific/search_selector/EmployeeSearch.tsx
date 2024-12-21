import { updateSearchParams } from "@/libs/helper";
import { Input } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";
import { FaSearch } from "react-icons/fa";

const EmployeeSearch = () => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSearchChange = useCallback(
    (value: string) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        const search = new URLSearchParams(Array.from(searchParams.entries()));
        const url = updateSearchParams(
          search,
          [
            {
              name: "query",
              value: value,
            },
          ],
          pathname
        );
        router.push(url);
      }, 300);
    },
    [searchParams, pathname]
  );

  return (
    <div className="bg-white p-3 rounded-t-md">
      <Input
        radius="sm"
        variant="bordered"
        defaultValue={searchParams.get("query") ?? undefined}
        startContent={<FaSearch className="text-zinc-400" />}
        placeholder="Tìm kiếm theo họ tên, email, SĐT, mã nhân viên"
        onValueChange={handleSearchChange}
      />
    </div>
  );
};
export default EmployeeSearch;
