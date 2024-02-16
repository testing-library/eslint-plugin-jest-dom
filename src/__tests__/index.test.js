import plugin from "../";

it("should have all the rules", () => {
  expect(Object.keys(plugin.rules).length).toBeGreaterThan(0);
});

it.each(Object.entries(plugin.rules))(
  "%s should export required fields",
  (name, rule) => {
    expect(rule).toHaveProperty("create", expect.any(Function));
    expect(rule.meta.docs.url).not.toBe("");
    expect(rule.meta.docs.category).toBe("Best Practices");
    expect(rule.meta.docs.description).not.toBe("");
  }
);

it("has the expected recommended config", () => {
  expect(plugin.configs.recommended).toMatchInlineSnapshot(`
    Object {
      plugins: Array [
        jest-dom,
      ],
      rules: Object {
        jest-dom/prefer-checked: error,
        jest-dom/prefer-empty: error,
        jest-dom/prefer-enabled-disabled: error,
        jest-dom/prefer-focus: error,
        jest-dom/prefer-in-document: error,
        jest-dom/prefer-required: error,
        jest-dom/prefer-to-have-attribute: error,
        jest-dom/prefer-to-have-class: error,
        jest-dom/prefer-to-have-style: error,
        jest-dom/prefer-to-have-text-content: error,
        jest-dom/prefer-to-have-value: error,
      },
    }
  `);
});

it("has the expected recommended flat config", () => {
  const expectJestDomPlugin = expect.objectContaining({
    meta: {
      name: "eslint-plugin-example",
      version: expect.any(String),
    },
  });

  expect(plugin.configs["flat/recommended"]).toMatchInlineSnapshot(
    { plugins: { "jest-dom": expectJestDomPlugin } },
    `
    Object {
      plugins: Object {
        jest-dom: ObjectContaining {
          meta: Object {
            name: eslint-plugin-example,
            version: Any<String>,
          },
        },
      },
      rules: Object {
        jest-dom/prefer-checked: error,
        jest-dom/prefer-empty: error,
        jest-dom/prefer-enabled-disabled: error,
        jest-dom/prefer-focus: error,
        jest-dom/prefer-in-document: error,
        jest-dom/prefer-required: error,
        jest-dom/prefer-to-have-attribute: error,
        jest-dom/prefer-to-have-class: error,
        jest-dom/prefer-to-have-style: error,
        jest-dom/prefer-to-have-text-content: error,
        jest-dom/prefer-to-have-value: error,
      },
    }
  `
  );
});
