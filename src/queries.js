import { queries as allQueries } from "@testing-library/dom";

export const queries = Object.keys(allQueries);

export const queriesByVariant = {
  query: queries.filter((q) => q.startsWith("query")),
  get: queries.filter((q) => q.startsWith("get")),
  find: queries.filter((q) => q.startsWith("find")),
};
