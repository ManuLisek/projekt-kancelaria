export function formatDate(date: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "long",
  }).format(new Date(date));
}
