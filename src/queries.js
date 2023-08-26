let theQueries = [
  "findAllByLabelText",
  "findByLabelText",
  "getAllByLabelText",
  "getByLabelText",
  "queryAllByLabelText",
  "queryByLabelText",
  "findAllByPlaceholderText",
  "findByPlaceholderText",
  "getAllByPlaceholderText",
  "getByPlaceholderText",
  "queryAllByPlaceholderText",
  "queryByPlaceholderText",
  "findAllByText",
  "findByText",
  "getAllByText",
  "getByText",
  "queryAllByText",
  "queryByText",
  "findAllByDisplayValue",
  "findByDisplayValue",
  "getAllByDisplayValue",
  "getByDisplayValue",
  "queryAllByDisplayValue",
  "queryByDisplayValue",
  "findAllByAltText",
  "findByAltText",
  "getAllByAltText",
  "getByAltText",
  "queryAllByAltText",
  "queryByAltText",
  "findAllByTitle",
  "findByTitle",
  "getAllByTitle",
  "getByTitle",
  "queryAllByTitle",
  "queryByTitle",
  "findAllByRole",
  "findByRole",
  "getAllByRole",
  "getByRole",
  "queryAllByRole",
  "queryByRole",
  "findAllByTestId",
  "findByTestId",
  "getAllByTestId",
  "getByTestId",
  "queryAllByTestId",
  "queryByTestId",
];

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
