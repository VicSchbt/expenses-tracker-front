export const formatDateFR = (date: Date): string => {
  const formatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short" });
  const formattedDate = formatter.format(date);
  return formattedDate;
};
