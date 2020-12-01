/**
 * @fileoverview Prefer toBeInTheDocument over querying and asserting length.
 * @author Anton Niklasson
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { RuleTester } from "eslint";
import * as rule from "../../../rules/prefer-in-document";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

function invalidCase(code, output) {
  return {
    code,
    output,
    errors: [
      {
        messageId: "use-document",
      },
    ],
  };
}

const valid = [
  ...["getByText", "getByRole"].map((q) => [
    `expect(screen.${q}('foo')).toBeInTheDocument()`,
    `expect(${q}('foo')).toBeInTheDocument()`,
    `expect(wrapper.${q}('foo')).toBeInTheDocument()`,
    `let foo;
      foo = screen.${q}('foo');
      foo = somethingElse;
      expect(foo).toHaveLength(1);`,
  ]),
  `let foo;
  foo = "bar";
  expect(foo).toHaveLength(1);`,
  `let foo;
  foo = "bar";
  expect(foo).toHaveLength(0);`,
  `let foo;
  expect(foo).toHaveLength(1);`,
  `expect(screen.notAQuery('foo-bar')).toHaveLength(1)`,
  `expect(screen.getAllByText('foo-bar')).toHaveLength(2)`,
  `import foo from "./foo";
  it('should be defined', () => {
    expect(useBoolean).toBeDefined();
  })`,
  `const span = foo('foo') as HTMLSpanElement`,
  `const rtl = render()
  const stars = rtl.container.querySelector('div').children

  expect(rtl.container.children).toHaveLength(1)
  expect(stars).toHaveLength(5)`,
  `    let content = container.querySelector('p')

    expect(content).not.toBeNull()

    fireEvent.click(closeButton)

    await waitExpect(
      () => {
        content = container.querySelector('p')
        expect(content).toBeNull()
      }
    )`,
];
const invalid = [
  // Invalid cases that applies to all variants

  invalidCase(
    `expect(screen.getByText('foo')).toHaveLength(1)`,
    `expect(screen.getByText('foo')).toBeInTheDocument()`
  ),
  invalidCase(
    `expect(getByText('foo')).toHaveLength(1)`,
    `expect(getByText('foo')).toBeInTheDocument()`
  ),
  invalidCase(
    `expect(wrapper.getByText('foo')).toHaveLength(1)`,
    `expect(wrapper.getByText('foo')).toBeInTheDocument()`
  ),
  invalidCase(
    `const foo = screen.getByText('foo');
    expect(foo).toHaveLength(1);`,
    `const foo = screen.getByText('foo');
    expect(foo).toBeInTheDocument();`
  ),
  invalidCase(
    `const foo = getByText('foo');
    expect(foo).toHaveLength(1);`,
    `const foo = getByText('foo');
    expect(foo).toBeInTheDocument();`
  ),
  invalidCase(
    `let foo;
    foo = getByText('foo');
    expect(foo).toHaveLength(1);`,
    `let foo;
    foo = getByText('foo');
    expect(foo).toBeInTheDocument();`
  ),
  invalidCase(
    `let foo;
    foo = screen.getByText('foo');
    expect(foo).toHaveLength(1);`,
    `let foo;
    foo = screen.getByText('foo');
    expect(foo).toBeInTheDocument();`
  ),
  invalidCase(
    `expect(screen.getAllByRole('foo')).toHaveLength(1)`,
    `expect(screen.getByRole('foo')).toBeInTheDocument()`
  ),
  invalidCase(
    `expect(await screen.findAllByRole('foo')).toHaveLength(1)`,
    `expect(await screen.findByRole('foo')).toBeInTheDocument()`
  ),
  invalidCase(
    `expect(getAllByRole('foo')).toHaveLength(1)`,
    `expect(getByRole('foo')).toBeInTheDocument()`
  ),
  invalidCase(
    `expect(wrapper.getAllByRole('foo')).toHaveLength(1)`,
    `expect(wrapper.getByRole('foo')).toBeInTheDocument()`
  ),
  invalidCase(
    `const foo = screen.getAllByRole('foo');
    expect(foo).toHaveLength(1);`,
    `const foo = screen.getByRole('foo');
    expect(foo).toBeInTheDocument();`
  ),
  invalidCase(
    `const foo = getAllByRole('foo');
    expect(foo).toHaveLength(1);`,
    `const foo = getByRole('foo');
    expect(foo).toBeInTheDocument();`
  ),
  invalidCase(
    `let foo;
    foo = getAllByRole('foo');
    expect(foo).toHaveLength(1);`,
    `let foo;
    foo = getByRole('foo');
    expect(foo).toBeInTheDocument();`
  ),
  invalidCase(
    `let foo;
    foo = screen.getAllByRole('foo');
    expect(foo).toHaveLength(1);`,
    `let foo;
    foo = screen.getByRole('foo');
    expect(foo).toBeInTheDocument();`
  ),

  invalidCase(
    `expect(screen.getByText('foo')).toHaveLength(1)`,
    `expect(screen.getByText('foo')).toBeInTheDocument()`
  ),
  invalidCase(
    `expect(getByText('foo')).toHaveLength(1)`,
    `expect(getByText('foo')).toBeInTheDocument()`
  ),
  invalidCase(
    `expect(wrapper.getByText('foo')).toHaveLength(1)`,
    `expect(wrapper.getByText('foo')).toBeInTheDocument()`
  ),
  invalidCase(
    `const foo = screen.getByText('foo');
  expect(foo).toHaveLength(1);`,
    `const foo = screen.getByText('foo');
  expect(foo).toBeInTheDocument();`
  ),
  invalidCase(
    `const foo = getByText('foo');
  expect(foo).toHaveLength(1);`,
    `const foo = getByText('foo');
  expect(foo).toBeInTheDocument();`
  ),
  invalidCase(
    `let foo;
  foo = getByText('foo');
  expect(foo).toHaveLength(1);`,
    `let foo;
  foo = getByText('foo');
  expect(foo).toBeInTheDocument();`
  ),
  invalidCase(
    `let foo;
  foo = screen.getByText('foo');
  expect(foo).toHaveLength(1);`,
    `let foo;
  foo = screen.getByText('foo');
  expect(foo).toBeInTheDocument();`
  ),

  // Invalid cases that applies to queryBy* and queryAllBy*
  ...["queryByText", "queryAllByText"].map((q) => [
    invalidCase(
      `expect(${q}('foo')).toHaveLength(0)`,
      `expect(${q}('foo')).not.toBeInTheDocument()`
    ),
    invalidCase(
      `expect(${q}('foo')).toBeNull()`,
      `expect(${q}('foo')).not.toBeInTheDocument()`
    ),
    invalidCase(
      `expect(${q}('foo')).not.toBeNull()`,
      `expect(${q}('foo')).toBeInTheDocument()`
    ),
    invalidCase(
      `expect(${q}('foo')) .not .toBeNull()`,
      `expect(${q}('foo')).toBeInTheDocument()`
    ),
    invalidCase(
      `expect(${q}('foo')).toBeDefined()`,
      `expect(${q}('foo')).toBeInTheDocument()`
    ),
    invalidCase(
      `expect(${q}('foo')) .not .toBeDefined()`,
      `expect(${q}('foo')) .not .toBeInTheDocument()`
    ),
    invalidCase(
      `let foo;
      foo = screen.${q}('foo');
      expect(foo).toHaveLength(0);`,
      `let foo;
      foo = screen.${q}('foo');
      expect(foo).not.toBeInTheDocument();`
    ),
    invalidCase(
      `let foo;
      foo = screen.${q}('foo');
      expect(foo) .not.toBeNull();`,
      `let foo;
      foo = screen.${q}('foo');
      expect(foo).toBeInTheDocument();`
    ),
    invalidCase(
      `let foo = screen.${q}('foo');
      expect(foo).not.toBeNull();`,
      `let foo = screen.${q}('foo');
      expect(foo).toBeInTheDocument();`
    ),
  ]),
  invalidCase(
    `it("foo", async () => {
      expect(await findByRole("button")).toBeDefined();
    })`,
    `it("foo", async () => {
      expect(await findByRole("button")).toBeInTheDocument();
    })`
  ),
  invalidCase(
    `it("foo", async () => {
      expect(await findByRole("button")).not.toBeNull();
    })`,
    `it("foo", async () => {
      expect(await findByRole("button")).toBeInTheDocument();
    })`
  ),
  invalidCase(
    `it("foo", async () => {
      expect(await screen.findByText(/Compressing video/)).toBeDefined();
    })`,
    `it("foo", async () => {
      expect(await screen.findByText(/Compressing video/)).toBeInTheDocument();
    })`
  ),
  invalidCase(
    `it("foo", async () => {
      expect(await screen.findByText(/Compressing video/)).not.toBeDefined();
    })`,
    `it("foo", async () => {
      expect(await screen.findByText(/Compressing video/)).not.toBeInTheDocument();
    })`
  ),

  invalidCase(
    `it("foo", async () => {
      const compressingFeedback = await screen.findByText(/Compressing video/);
      expect(compressingFeedback).toBeDefined();
    });`,
    `it("foo", async () => {
      const compressingFeedback = await screen.findByText(/Compressing video/);
      expect(compressingFeedback).toBeInTheDocument();
    });`
  ),
  invalidCase(
    `it("foo", async () => {
      const compressingFeedback = await screen.findByText(/Compressing video/);
      expect(compressingFeedback).not.toBeNull();
    });`,
    `it("foo", async () => {
      const compressingFeedback = await screen.findByText(/Compressing video/);
      expect(compressingFeedback).toBeInTheDocument();
    });`
  ),
  invalidCase(
    `it("foo", async () => {
      let compressingFeedback;
      compressingFeedback = await screen.findByText(/Compressing video/);
      expect(compressingFeedback).toBeDefined();
    });`,
    `it("foo", async () => {
      let compressingFeedback;
      compressingFeedback = await screen.findByText(/Compressing video/);
      expect(compressingFeedback).toBeInTheDocument();
    });`
  ),
  invalidCase(
    `it("foo", async () => {
      let compressingFeedback;
      compressingFeedback = await screen.findByText(/Compressing video/);
      expect(compressingFeedback).not.toBeDefined();
    });`,
    `it("foo", async () => {
      let compressingFeedback;
      compressingFeedback = await screen.findByText(/Compressing video/);
      expect(compressingFeedback).not.toBeInTheDocument();
    });`
  ),
  invalidCase(
    `const span = getByText('foo') as HTMLSpanElement
  expect(span).not.toBeNull()`,
    `const span = getByText('foo') as HTMLSpanElement
  expect(span).toBeInTheDocument()`
  ),
  invalidCase(
    `const span = await findByText('foo') as HTMLSpanElement
  expect(span).not.toBeNull()`,
    `const span = await findByText('foo') as HTMLSpanElement
  expect(span).toBeInTheDocument()`
  ),
  invalidCase(
    `let span;
     span = getByText('foo') as HTMLSpanElement
  expect(span).not.toBeNull()`,
    `let span;
     span = getByText('foo') as HTMLSpanElement
  expect(span).toBeInTheDocument()`
  ),
  invalidCase(
    `const things = screen.getAllByText("foo");
  expect(things).toHaveLength(1);`,
    `const things = screen.getByText("foo");
  expect(things).toBeInTheDocument();`
  ),
];

const ruleTester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: { ecmaVersion: 2020, sourceType: "module" },
});
ruleTester.run("prefer-in-document", rule, {
  valid: [].concat(...valid),
  invalid: [].concat(...invalid),
});
