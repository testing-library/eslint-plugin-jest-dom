/**
 * @fileoverview prefer toHaveAttribute over checking  getAttribute/hasAttribute
 * @author Ben Monro
 */
import { getSourceCode } from "../context";

const escapeForRegexLiteral = (value) =>
  value
    .toString()
    .replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&")
    .replace(/\//g, "\\/")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
const getExactReplacementPattern = (expectedArg) => {
  if (!expectedArg) {
    return null;
  }

  if (expectedArg.type === "Literal" && typeof expectedArg.value === "string") {
    return `/^${escapeForRegexLiteral(expectedArg.value)}$/`;
  }

  if (
    expectedArg.type === "TemplateLiteral" &&
    expectedArg.expressions.length === 0
  ) {
    const cookedValue = expectedArg.quasis[0].value.cooked;
    return `/^${escapeForRegexLiteral(cookedValue)}$/`;
  }

  return null;
};

export const meta = {
  docs: {
    category: "Best Practices",
    url: "prefer-to-have-text-content",
    description: "Prefer toHaveTextContent over checking element.textContent",
    recommended: true,
  },
  fixable: "code",
};

export const create = (context) => ({
  [`MemberExpression[property.name='textContent'][parent.callee.name='expect'][parent.parent.property.name=/toContain$|toMatch$/]`](
    node,
  ) {
    const expectedArg = node.parent.parent.parent.arguments[0];

    const expectedArgSource = getSourceCode(context).getText(expectedArg);
    context.report({
      node: node.parent,
      message: `Use toHaveTextContent instead of asserting on DOM node attributes`,
      fix: (fixer) => {
        return [
          fixer.removeRange([node.object.range[1], node.property.range[1]]),
          fixer.replaceTextRange(
            node.parent.parent.property.range,
            "toHaveTextContent",
          ),
          fixer.replaceTextRange(
            expectedArg.range,
            expectedArg.type === "Literal"
              ? expectedArg.regex
                ? expectedArgSource
                : new RegExp(
                    expectedArg.value
                      .toString()
                      .replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"),
                  ).toString()
              : `new RegExp(${expectedArgSource})`,
          ),
        ];
      },
    });
  },
  [`MemberExpression[property.name='textContent'][parent.callee.name='expect'][parent.parent.property.name=/^(toBe|toEqual|toStrictEqual)$/]`](
    node,
  ) {
    const expectedArg = node.parent.parent.parent.arguments[0];
    context.report({
      node: node.parent,
      message: `Use toHaveTextContent instead of asserting on DOM node attributes`,
      fix: (fixer) => {
        const replacementPattern = getExactReplacementPattern(expectedArg);

        if (replacementPattern === null) {
          return null;
        }

        return [
          fixer.removeRange([node.object.range[1], node.property.range[1]]),
          fixer.replaceTextRange(
            node.parent.parent.property.range,
            "toHaveTextContent",
          ),
          fixer.replaceTextRange(expectedArg.range, replacementPattern),
        ];
      },
    });
  },
  [`MemberExpression[property.name='textContent'][parent.callee.name='expect'][parent.parent.property.name='not'][parent.parent.parent.property.name=/^(toBe|toEqual|toStrictEqual)$/]`](
    node,
  ) {
    const expectedArg = node.parent.parent.parent.parent.arguments[0];
    context.report({
      node: node.parent,
      message: `Use toHaveTextContent instead of asserting on DOM node attributes`,
      fix: (fixer) => {
        const replacementPattern = getExactReplacementPattern(expectedArg);

        if (replacementPattern === null) {
          return null;
        }

        return [
          fixer.removeRange([node.object.range[1], node.property.range[1]]),
          fixer.replaceTextRange(
            node.parent.parent.parent.property.range,
            "toHaveTextContent",
          ),
          fixer.replaceTextRange(expectedArg.range, replacementPattern),
        ];
      },
    });
  },
  [`MemberExpression[property.name='textContent'][parent.callee.name='expect'][parent.parent.property.name='not'][parent.parent.parent.property.name=/toContain$|toMatch$/]`](
    node,
  ) {
    const expectedArg = node.parent.parent.parent.parent.arguments[0];
    const expectedArgSource = getSourceCode(context).getText(expectedArg);
    context.report({
      node: node.parent,
      message: `Use toHaveTextContent instead of asserting on DOM node attributes`,
      fix: (fixer) => [
        fixer.removeRange([node.object.range[1], node.property.range[1]]),
        fixer.replaceTextRange(
          node.parent.parent.parent.property.range,
          "toHaveTextContent",
        ),
        fixer.replaceTextRange(
          expectedArg.range,
          expectedArg.type === "Literal"
            ? expectedArg.regex
              ? expectedArgSource
              : new RegExp(
                  expectedArg.value
                    .toString()
                    .replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"),
                ).toString()
            : `new RegExp(${expectedArgSource})`,
        ),
      ],
    });
  },
});
