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

    expect([...queries].sort()).toStrictEqual([
      "findAllByAltText",
      "findAllByDisplayValue",
      "findAllByLabelText",
      "findAllByPlaceholderText",
      "findAllByRole",
      "findAllByTestId",
      "findAllByText",
      "findAllByTitle",
      "findByAltText",
      "findByDisplayValue",
      "findByLabelText",
      "findByPlaceholderText",
      "findByRole",
      "findByTestId",
      "findByText",
      "findByTitle",
      "getAllByAltText",
      "getAllByDisplayValue",
      "getAllByLabelText",
      "getAllByPlaceholderText",
      "getAllByRole",
      "getAllByTestId",
      "getAllByText",
      "getAllByTitle",
      "getByAltText",
      "getByDisplayValue",
      "getByLabelText",
      "getByPlaceholderText",
      "getByRole",
      "getByTestId",
      "getByText",
      "getByTitle",
      "queryAllByAltText",
      "queryAllByDisplayValue",
      "queryAllByLabelText",
      "queryAllByPlaceholderText",
      "queryAllByRole",
      "queryAllByTestId",
      "queryAllByText",
      "queryAllByTitle",
      "queryByAltText",
      "queryByDisplayValue",
      "queryByLabelText",
      "queryByPlaceholderText",
      "queryByRole",
      "queryByTestId",
      "queryByText",
      "queryByTitle",
    ]);
  });
});

describe("when @testing-library/dom is available", () => {
  it("returns the queries from the library", () => {
    const { queries } = requireQueries(false);

    expect([...queries].sort()).toStrictEqual([
      "findAllByAltText",
      "findAllByDisplayValue",
      "findAllByLabelText",
      "findAllByPlaceholderText",
      "findAllByRole",
      "findAllByTestId",
      "findAllByText",
      "findAllByTitle",
      "findByAltText",
      "findByDisplayValue",
      "findByLabelText",
      "findByPlaceholderText",
      "findByRole",
      "findByTestId",
      "findByText",
      "findByTitle",
      "getAllByAltText",
      "getAllByDisplayValue",
      "getAllByLabelText",
      "getAllByPlaceholderText",
      "getAllByRole",
      "getAllByTestId",
      "getAllByText",
      "getAllByTitle",
      "getByAltText",
      "getByDisplayValue",
      "getByLabelText",
      "getByPlaceholderText",
      "getByRole",
      "getByTestId",
      "getByText",
      "getByTitle",
      "queryAllByAltText",
      "queryAllByDisplayValue",
      "queryAllByLabelText",
      "queryAllByPlaceholderText",
      "queryAllByRole",
      "queryAllByTestId",
      "queryAllByText",
      "queryAllByTitle",
      "queryByAltText",
      "queryByDisplayValue",
      "queryByLabelText",
      "queryByPlaceholderText",
      "queryByRole",
      "queryByTestId",
      "queryByText",
      "queryByTitle",
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
