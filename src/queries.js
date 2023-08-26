let theQueries = [
  "findAllBy",
  "findBy",
  "getAllBy",
  "getBy",
  "queryAllBy",
  "queryBy",
].flatMap((prefix) =>
  [
    "AltText",
    "DisplayValue",
    "LabelText",
    "PlaceholderText",
    "Role",
    "TestId",
    "Text",
    "Title",
  ].map((element) => `${prefix}${element}`)
);

(() => {
  try {
    const { queries: allQueries } = require("@testing-library/dom");

    theQueries = Object.keys(allQueries);
  } catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") {
      throw error;
    }
  }
})();

export const queries = theQueries;
