import { getQueryNodeFrom } from "./assignment-ast";

/**
 * Creates a rule that suggests using a "partially" matcher (e.g. toBePartiallyChecked,
 * toBePartiallyPressed) instead of checking for the "mixed" value of a tri-state
 * aria attribute (aria-checked, aria-pressed).
 */
export default ({ preferred, attribute }) => (context) => {
  const isMixedValue = (node) =>
    node.arguments.length === 2 &&
    node.arguments[0].type === "Literal" &&
    node.arguments[0].value === attribute &&
    node.arguments[1].type === "Literal" &&
    typeof node.arguments[1].value === "string" &&
    node.arguments[1].value.toLowerCase() === "mixed";

  return {
    // expect(el).toHaveAttribute('aria-pressed', 'mixed') => expect(el).toBePartiallyPressed()
    "CallExpression[callee.object.callee.name='expect'][callee.property.name=/toHaveProperty|toHaveAttribute/]"(
      node
    ) {
      if (!isMixedValue(node)) {
        return;
      }

      const { isDTLQuery } = getQueryNodeFrom(
        context,
        node.callee.object.arguments[0]
      );
      if (!isDTLQuery) return;

      const incorrectFunction = node.callee.property.name;
      context.report({
        node: node.callee.property,
        message: `Use ${preferred}() instead of ${incorrectFunction}('${attribute}', 'mixed')`,
        fix: (fixer) => [
          fixer.replaceTextRange(
            [node.callee.property.range[0], node.range[1]],
            `${preferred}()`
          ),
        ],
      });
    },
    // expect(el).not.toHaveAttribute('aria-pressed', 'mixed') => expect(el).not.toBePartiallyPressed()
    "CallExpression[callee.property.name=/toHaveProperty|toHaveAttribute/][callee.object.property.name='not'][callee.object.object.callee.name='expect']"(
      node
    ) {
      if (!isMixedValue(node)) {
        return;
      }

      const incorrectFunction = node.callee.property.name;
      context.report({
        node,
        message: `Use not.${preferred}() instead of not.${incorrectFunction}('${attribute}', 'mixed')`,
        fix: (fixer) =>
          fixer.replaceTextRange(
            [node.callee.object.property.range[0], node.range[1]],
            `not.${preferred}()`
          ),
      });
    },
  };
};
