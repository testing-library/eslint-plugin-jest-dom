/**
 * @fileoverview prefer toBeInvalid over checking aria-invalid or the validity of an element
 */

import { getQueryNodeFrom } from "../assignment-ast";
import { getSourceCode } from "../context";

export const meta = {
  docs: {
    description:
      "prefer toBeInvalid over checking aria-invalid or validity state",
    category: "Best Practices",
    recommended: false,
    url: "prefer-to-be-invalid",
  },
  fixable: "code",
  messages: {
    preferInvalid: "Use toBeInvalid() instead of {{found}}",
  },
};

const isLiteral = (node, value) =>
  node?.type === "Literal" && node.value === value;

const isNamed = (node, name) =>
  node?.type === "MemberExpression" &&
  !node.computed &&
  node.property.name === name;

/** `validity.valid` as a path of `toHaveProperty` */
const isValidityPath = (node) =>
  isLiteral(node, "validity.valid") ||
  (node?.type === "ArrayExpression" &&
    node.elements.length === 2 &&
    isLiteral(node.elements[0], "validity") &&
    isLiteral(node.elements[1], "valid"));

/** The assertion says that its value is `false`. */
const expectsFalse = (matcher, args) =>
  matcher === "toBeFalsy"
    ? args.length === 0
    : /^to(Be|(Strict)?Equal)$/.test(matcher) &&
      args.length === 1 &&
      isLiteral(args[0], false);

export const create = (context) => {
  const isElement = (node) => getQueryNodeFrom(context, node).isDTLQuery;

  const report = (node, found, element) => {
    context.report({
      node,
      messageId: "preferInvalid",
      data: { found },
      fix: (fixer) => [
        fixer.replaceText(
          node.callee.object.arguments[0],
          getSourceCode(context).getText(element),
        ),
        fixer.replaceTextRange(
          [node.callee.property.range[0], node.range[1]],
          "toBeInvalid()",
        ),
      ],
    });
  };

  return {
    "CallExpression[callee.type='MemberExpression'][callee.computed=false][callee.object.callee.name='expect']"(
      node,
    ) {
      const [actual] = node.callee.object.arguments;
      const matcher = node.callee.property.name;
      const args = node.arguments;

      if (!actual) {
        return;
      }

      // expect(input).toHaveAttribute("aria-invalid", "true")
      if (
        matcher === "toHaveAttribute" &&
        isLiteral(args[0], "aria-invalid") &&
        isLiteral(args[1], "true") &&
        isElement(actual)
      ) {
        report(node, "checking aria-invalid", actual);
        return;
      }

      // expect(input).toHaveProperty("validity.valid", false)
      if (
        matcher === "toHaveProperty" &&
        isValidityPath(args[0]) &&
        isLiteral(args[1], false) &&
        isElement(actual)
      ) {
        report(node, "checking validity.valid", actual);
        return;
      }

      if (!expectsFalse(matcher, args)) {
        return;
      }

      // expect(input.checkValidity()).toBe(false)
      if (
        actual.type === "CallExpression" &&
        isNamed(actual.callee, "checkValidity") &&
        actual.arguments.length === 0 &&
        isElement(actual.callee.object)
      ) {
        report(node, "checking checkValidity()", actual.callee.object);
        return;
      }

      // expect(input.validity.valid).toBe(false)
      if (
        isNamed(actual, "valid") &&
        isNamed(actual.object, "validity") &&
        isElement(actual.object.object)
      ) {
        report(node, "checking validity.valid", actual.object.object);
      }
    },
  };
};
