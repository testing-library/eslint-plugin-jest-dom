function constructQueries() {
  const strategies = [
    "LabelText",
    "PlaceholderText",
    "Text",
    "AltText",
    "Title",
    "DisplayValue",
    "Role",
    "TestId",
  ];

  const by = [
    "getBy",
    "getAllBy",
    "queryBy",
    "queryAllBy",
    "findBy",
    "findAllBy",
  ];

  return by.reduce((acc, q) => {
    return [...acc, ...strategies.map((qs) => q + qs)];
  }, []);
}

export const queries = constructQueries();
