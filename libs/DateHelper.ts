export const getToday = () => {
  return new Date();
};

export const getPreviousDay = (numberOfDay: number) => {
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - numberOfDay);
  return startDate;
};

export const getLastWeekStartEnd = () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() - 7 + 1);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return {
    start: startOfWeek,
    end: endOfWeek,
  };
};

export const getThisWeekStartEnd = () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return {
    start: startOfWeek,
    end: endOfWeek,
  };
};

export const getLastMonthStartEnd = () => {
  const today = new Date();

  const firstDayOfCurrentMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  // Tính ngày đầu tiên của tháng trước
  const firstDayOfLastMonth = new Date(firstDayOfCurrentMonth);
  firstDayOfLastMonth.setMonth(firstDayOfCurrentMonth.getMonth() - 1);

  // Tính ngày cuối cùng của tháng trước
  const lastDayOfLastMonth = new Date(firstDayOfCurrentMonth);
  lastDayOfLastMonth.setDate(firstDayOfCurrentMonth.getDate() - 1);

  return {
    start: firstDayOfLastMonth,
    end: lastDayOfLastMonth,
  };
};

export const getThisMonthStartEnd = () => {
  // Lấy ngày hôm nay
  const today = new Date();

  // Tính ngày đầu tiên của tháng hiện tại
  const firstDayOfCurrentMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  // Tính ngày cuối cùng của tháng hiện tại
  const lastDayOfCurrentMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  );

  return {
    start: firstDayOfCurrentMonth,
    end: lastDayOfCurrentMonth,
  };
};

export const getLastYearStartEnd = () => {
  const today = new Date();
  const lastYear = today.getFullYear() - 1;

  // Tính ngày đầu tiên của năm trước
  const startOfLastYear = new Date(lastYear, 0, 1);

  // Tính ngày cuối cùng của năm trước
  const endOfLastYear = new Date(lastYear, 11, 31);

  return {
    start: startOfLastYear,
    end: endOfLastYear,
  };
};

export const getThisYearStartEnd = () => {
  // Lấy năm hiện tại
  const today = new Date();
  const currentYear = today.getFullYear();

  // Tính ngày đầu tiên của năm hiện tại
  const startOfCurrentYear = new Date(currentYear, 0, 1);

  // Tính ngày cuối cùng của năm hiện tại
  const endOfCurrentYear = new Date(currentYear, 11, 31);

  return {
    start: startOfCurrentYear,
    end: endOfCurrentYear,
  };
};
