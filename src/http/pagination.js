export const PAGE_SIZE_MAX = 100;

export const unwrapPage = (r) => ({
  results: r.data?.results ?? [],
  count: r.data?.count ?? 0,
  next: r.data?.next ?? null,
  previous: r.data?.previous ?? null,
});
