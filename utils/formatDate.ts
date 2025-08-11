const formatMonthShortDate = (date: Date, currentLanCode: string) => {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString(currentLanCode, options);
};

const formatMonthYear = (dateString: string, currentLanCode: string) => {
  const date = new Date(dateString + "-01");
  return date.toLocaleDateString(currentLanCode, {
    month: "long",
    year: "numeric",
  });
};

const formatSelectedDate = (dateString: string, currentLanCode: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(currentLanCode, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateHistory = (date: Date, currentLanCode: string, t: any) => {
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffInDays === 0) return t("today");
  if (diffInDays === 1) return t("yesterday");
  if (diffInDays < 7) return t("daysAgo", { count: diffInDays });

  return date.toLocaleDateString(currentLanCode, {
    month: "short",
    day: "numeric",
  });
};

const formatEventDate = (date: Date, currentLanCode: string) => {
  return date.toLocaleDateString(currentLanCode, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export {
  formatMonthShortDate,
  formatMonthYear,
  formatSelectedDate,
  formatDateHistory,
  formatEventDate,
};
