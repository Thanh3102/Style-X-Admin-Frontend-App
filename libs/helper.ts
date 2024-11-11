export const Compare = (
  first: string | number | null | undefined,
  second: string | number | null | undefined
): number => {
  if (first === second) {
    return 0;
  }

  if (!first) {
    return -1;
  }
  if (!second) {
    return 1;
  }

  if (typeof first === "string" && typeof second === "string") {
    return first.localeCompare(second);
  }

  return first < second ? -1 : 1;
};

/**
 *
 * @returns URL sau khi cập nhật
 */

export const updateSearchParams = (
  urlSearchParams: URLSearchParams,
  params: { name: string; value: string | null | undefined }[],
  pathname: string
) => {
  // Nếu giá trị rỗng thì sẽ xóa nếu đang có giá trị
  for (let param of params) {
    if (!param.value) {
      if (urlSearchParams.has(param.name)) urlSearchParams.delete(param.name);
    } else {
      // Nếu có giá trị thì sẽ cập nhật nếu có, thêm vào nếu không có param
      if (urlSearchParams.has(param.name)) {
        urlSearchParams.set(param.name, param.value);
      } else {
        urlSearchParams.append(param.name, param.value);
      }
    }
  }

  // Chuyển về dạng string
  const search = urlSearchParams.toString();
  const query = search ? `?${search}` : "";
  return `${pathname}${query}`;
};