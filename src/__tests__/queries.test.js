const TestingLibraryDomRef = { throwWhenRequiring: false };

const requireQueries = (throwWhenRequiring) => {
  jest.resetModules();

  TestingLibraryDomRef.throwWhenRequiring = throwWhenRequiring;

  return require("../queries");
};

jest.mock("@testing-library/dom", () => {
  if (TestingLibraryDomRef.throwWhenRequiring) {
    throw new (class extends Error {
      constructor(message) {
        super(message);
        this.code = "MODULE_NOT_FOUND";
      }
    })();
  }

  return jest.requireActual("@testing-library/dom");
});

describe("when @testing-library/dom is not available", () => {
  it("uses the default queries", () => {
    const { queries } = requireQueries(true);

    expect(queries).toStrictEqual([
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
    ]);
  });
});

describe("when @testing-library/dom is available", () => {
  it("returns the queries from the library", () => {
    const { queries } = requireQueries(false);

    expect(queries).toStrictEqual([
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
    ]);
  });

  it("re-throws unexpected errors", () => {
    jest.mock("@testing-library/dom", () => {
      throw new Error("oh noes!");
    });

    jest.resetModules();

    expect(() => require("../queries")).toThrow(/oh noes!/iu);
  });
});
