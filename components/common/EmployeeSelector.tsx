"use client";
import { AutocompleteItem } from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { FormAutoComplete } from "./Form";
import { useCallback, useEffect, useRef, useState } from "react";
import { FilterParam } from "@/libs/types/backend";
import { EMPLOYEE_GET_ROUTE } from "@/constants/api-routes";
import { UserBasic } from "@/libs/types/user";
import { useImmer } from "use-immer";
import { getSession } from "next-auth/react";
import { GroupBox } from "../ui/GroupBox";
import { GetUsersResponse } from "@/libs/types/backend/response";

export type EmployeeSelectorProps = {
  defaultInputValue?: string;
  defaultSelectedKey?: string;
  isValid?: boolean;
  error?: string;
  onKeyChange?: (value: string) => void;
};

const EmployeeSelector = ({
  defaultInputValue,
  defaultSelectedKey,
  isValid,
  error,
  onKeyChange,
}: EmployeeSelectorProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [users, setUser] = useImmer<UserBasic[]>([]);
  const queryTimeoutRef = useRef<NodeJS.Timeout>();
  const limit = 20;

  const getUsers = useCallback(
    async (p: number, lim: number, query?: string) => {
      try {
        setIsLoading(true);
        const session = await getSession();
        const url = `${EMPLOYEE_GET_ROUTE}?${FilterParam.QUERY}=${
          query ?? ""
        }&${FilterParam.PAGE}=${p}&${FilterParam.LIMIT}=${lim}`;
        const res = await fetch(url, {
          headers: {
            authorization: `Bearer ${session?.accessToken}`,
          },
        });
        if (res.ok) {
          const data: GetUsersResponse = await res.json();
          setUser(data.employees);
          setHasMore(data.paginition.hasMore);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    },
    []
  );

  const handleInputChange = (value: string) => {
    if (queryTimeoutRef.current) clearTimeout(queryTimeoutRef.current);
    const queryTimeout = setTimeout(() => {
      getUsers(1, limit, value);
      setPage(1);
    }, 1000);
    queryTimeoutRef.current = queryTimeout;
  };

  const loadMoreUser = async () => {
    setIsLoading(true);
    const session = await getSession();
    const res = await fetch(
      `${EMPLOYEE_GET_ROUTE}?${FilterParam.PAGE}=${page + 1}&${
        FilterParam.LIMIT
      }=${limit}`,
      {
        headers: {
          authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );
    if (res.ok) {
      const data: GetUsersResponse = await res.json();
      setUser((users) => [...users, data.employees]);
      setHasMore(data.paginition.hasMore);
    }
    setIsLoading(false);
  };

  const [, scrollRef] = useInfiniteScroll({
    isEnabled: isOpen,
    shouldUseLoader: true,
    hasMore: hasMore,
    onLoadMore: loadMoreUser,
  });

  useEffect(() => {
    getUsers(page, limit, defaultInputValue);
  }, []);

  return (
    <GroupBox title="Nhân viên phụ trách">
      <div className="col-12">
        <FormAutoComplete
          isLoading={isLoading}
          isInvalid={isValid}
          isClearable={false}
          errorMessage={error}
          scrollRef={scrollRef}
          onInputChange={handleInputChange}
          onSelectionChange={(key) => {
            if (onKeyChange) onKeyChange(key as string);
          }}
          onOpenChange={(open) => setIsOpen(open)}
          defaultInputValue={defaultInputValue}
          defaultSelectedKey={defaultSelectedKey}
        >
          {users.map((user) => (
            <AutocompleteItem key={user.id}>{user.name}</AutocompleteItem>
          ))}
        </FormAutoComplete>
      </div>
    </GroupBox>
  );
};

export { EmployeeSelector };
