type ConvertDateToStringOption = {
  getTime?: boolean;
};

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

export const convertDateToString = (
  inputDate: Date | string,
  options: ConvertDateToStringOption = { getTime: true }
) => {
  const { getTime } = options;
  const DATE =
    typeof inputDate === "string" ? inputDate : inputDate.toISOString();

  const newDate = new Date(DATE);

  const vietnamTime = newDate.toLocaleString("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour12: false,
  });


  const [date, time] = vietnamTime.split(", ");
  const [mm, dd, yyyy] = date.split("/");
  const [h, m] = time.split(".")[0].split(":");

  if (getTime) return `${dd}/${mm}/${yyyy} ${h}:${m}`;

  return `${dd}/${mm}/${yyyy}`;
};

export const isInteger = (str: string | undefined) => {
  if (!str) return false;
  const num = parseInt(str, 10);
  return !isNaN(num) && Number.isInteger(num) && String(num) === str;
};
