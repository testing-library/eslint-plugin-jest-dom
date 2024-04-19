/**
 * @fileoverview prefer toHaveStyle over checking element style
 * @author Ben Monro
 */
import { getSourceCode } from '../context';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
const camelCase = (str) => str.replace(/-([a-z])/g, (c) => c[1].toUpperCase());
export const meta = {
  docs: {
    category: "Best Practices",
    url: "prefer-to-have-style",
    description: "prefer toHaveStyle over checking element style",
    recommended: true,
  },
  fixable: "code",
};

export const create = (context) => {
  function getReplacementObjectProperty(styleName) {
    if (styleName.type === "Literal") {
      return camelCase(styleName.value);
    }

    return `[${getSourceCode(context).getText(styleName)}]`;
  }
  function getReplacementStyleParam(styleName, styleValue) {
    return styleName.type === "Literal"
      ? `{${camelCase(styleName.value)}: ${context
          .getSourceCode()
          .getText(styleValue)}}`
      : `${getSourceCode(context).getText(styleName).slice(0, -1)}: ${
          styleValue.type === "TemplateLiteral"
            ? getSourceCode(context).getText(styleValue).substring(1)
            : `${styleValue.value}\``
        }`;
  }

  return {
    //expect(el.style.foo).toBe("bar");
    [`MemberExpression[property.name=style][parent.computed=false][parent.parent.parent.property.name=/toBe$|to(Strict)?Equal/][parent.parent.parent.parent.arguments.0.type=/(Template)?Literal/][parent.parent.callee.name=expect]`](
      node
    ) {
      const styleName = node.parent.property;
      const [styleValue] = node.parent.parent.parent.parent.arguments;
      const matcher = node.parent.parent.parent.property;
      context.report({
        node: node.property,
        message: "Use toHaveStyle instead of asserting on element style",
        fix(fixer) {
          return [
            fixer.removeRange([node.object.range[1], styleName.range[1]]),
            fixer.replaceText(matcher, "toHaveStyle"),
            fixer.replaceText(
              styleValue,
              `{${styleName.name}:${context
                .getSourceCode()
                .getText(styleValue)}}`
            ),
          ];
        },
      });
    },
    //expect(el.style.foo).not.toBe("bar");
    [`MemberExpression[property.name=style][parent.computed=false][parent.parent.parent.property.name=not][parent.parent.parent.parent.property.name=/toBe$|to(Strict)?Equal/][parent.parent.parent.parent.parent.arguments.0.type=/(Template)?Literal$/][parent.parent.callee.name=expect]`](
      node
    ) {
      const styleName = node.parent.property;
      const styleValue = node.parent.parent.parent.parent.parent.arguments[0];
      const matcher = node.parent.parent.parent.parent.property;
      context.report({
        node: node.property,
        message: "Use toHaveStyle instead of asserting on element style",
        fix(fixer) {
          return [
            fixer.removeRange([node.object.range[1], styleName.range[1]]),
            fixer.replaceText(matcher, "toHaveStyle"),
            fixer.replaceText(
              styleValue,
              `{${styleName.name}:${context
                .getSourceCode()
                .getText(styleValue)}}`
            ),
          ];
        },
      });
    },
    // expect(el.style).toContain("foo-bar")
    [`MemberExpression[property.name=style][parent.parent.property.name=toContain][parent.parent.parent.arguments.0.type=/(Template)?Literal$/][parent.callee.name=expect]`](
      node
    ) {
      const [styleName] = node.parent.parent.parent.arguments;
      const matcher = node.parent.parent.property;

      context.report({
        node: node.property,
        message: "Use toHaveStyle instead of asserting on element style",
        fix(fixer) {
          return [
            fixer.removeRange([node.object.range[1], node.property.range[1]]),
            fixer.replaceText(matcher, "toHaveStyle"),
            fixer.replaceText(
              styleName,
              styleName.type === "Literal"
                ? `{${camelCase(styleName.value)}: expect.anything()}`
                : getSourceCode(context).getText(styleName)
            ),
          ];
        },
      });
    },
    // expect(el.style).not.toContain("foo-bar")
    [`MemberExpression[property.name=style][parent.parent.property.name=not][parent.parent.parent.property.name=toContain][parent.parent.parent.parent.arguments.0.type=/(Template)?Literal$/]`](
      node
    ) {
      const [styleName] = node.parent.parent.parent.parent.arguments;
      const matcher = node.parent.parent.parent.property;

      context.report({
        node: node.property,
        message: "Use toHaveStyle instead of asserting on element style",
        fix(fixer) {
          return [
            fixer.removeRange([node.object.range[1], node.property.range[1]]),
            fixer.replaceText(matcher, "toHaveStyle"),
            fixer.replaceText(
              styleName,
              styleName.type === "Literal"
                ? `{${camelCase(styleName.value)}: expect.anything()}`
                : getSourceCode(context).getText(styleName)
            ),
          ];
        },
      });
    },

    //expect(el).toHaveAttribute("style", "foo: bar");
    [`CallExpression[callee.property.name=toHaveAttribute][arguments.0.value=style][arguments.1][callee.object.callee.name=expect]`](
      node
    ) {
      context.report({
        node: node.arguments[0],
        message: "Use toHaveStyle instead of asserting on element style",
        fix(fixer) {
          return [
            fixer.replaceText(node.callee.property, "toHaveStyle"),
            fixer.removeRange([
              node.arguments[0].range[0],
              node.arguments[1].range[0],
            ]),
          ];
        },
      });
    },

    //expect(el.style["foo-bar"]).toBe("baz")
    [`MemberExpression[property.name=style][parent.computed=true][parent.parent.parent.property.name=/toBe$|to(Strict)?Equal/][parent.parent.parent.parent.arguments.0.type=/((Template)?Literal|Identifier)/][parent.parent.callee.name=expect]`](
      node
    ) {
      const styleName = node.parent.property;
      const [styleValue] = node.parent.parent.parent.parent.arguments;
      const matcher = node.parent.parent.parent.property;
      const startOfStyleMemberExpression = node.object.range[1];
      const endOfStyleMemberExpression =
        node.parent.parent.arguments[0].range[1];

      let fix = null;

      if (
        typeof styleValue.value !== "number" &&
        !(styleValue.value instanceof RegExp) &&
        styleName.type !== "Identifier"
      ) {
        fix = (fixer) => {
          return [
            fixer.removeRange([
              startOfStyleMemberExpression,
              endOfStyleMemberExpression,
            ]),
            fixer.replaceText(matcher, "toHaveStyle"),
            fixer.replaceText(
              styleValue,
              typeof styleName.value === "number"
                ? `{${getReplacementObjectProperty(
                    styleValue
                  )}: expect.anything()}`
                : getReplacementStyleParam(styleName, styleValue)
            ),
          ];
        };
      }

      context.report({
        node: node.property,
        message: "Use toHaveStyle instead of asserting on element style",
        fix,
      });
    },
    //expect(el.style["foo-bar"]).not.toBe("baz")
    [`MemberExpression[property.name=style][parent.computed=true][parent.parent.parent.property.name=not][parent.parent.parent.parent.parent.callee.property.name=/toBe$|to(Strict)?Equal/][parent.parent.parent.parent.parent.arguments.0.type=/(Template)?Literal/][parent.parent.callee.name=expect]`](
      node
    ) {
      const styleName = node.parent.property;
      const [styleValue] = node.parent.parent.parent.parent.parent.arguments;
      const matcher = node.parent.parent.parent.parent.property;
      const endOfStyleMemberExpression =
        node.parent.parent.arguments[0].range[1];

      let fix = null;

      if (
        typeof styleName.value !== "number" &&
        styleName.type !== "Identifier"
      ) {
        fix = (fixer) => {
          return [
            fixer.removeRange([
              node.object.range[1],
              endOfStyleMemberExpression,
            ]),
            fixer.replaceText(matcher, "toHaveStyle"),
            fixer.replaceText(
              styleValue,
              getReplacementStyleParam(styleName, styleValue)
            ),
          ];
        };
      }

      context.report({
        node: node.property,
        message: "Use toHaveStyle instead of asserting on element style",
        fix,
      });
    },
    //expect(foo.style).toHaveProperty("foo", "bar")
    [`MemberExpression[property.name=style][parent.parent.property.name=toHaveProperty][parent.callee.name=expect]`](
      node
    ) {
      const [styleName, styleValue] = node.parent.parent.parent.arguments;
      const matcher = node.parent.parent.property;

      context.report({
        node: node.property,
        message: "Use toHaveStyle instead of asserting on element style",
        fix(fixer) {
          if (
            !styleValue ||
            !["Literal", "TemplateLiteral"].includes(styleValue.type)
          ) {
            return null;
          }
          return [
            fixer.removeRange([node.object.range[1], node.property.range[1]]),
            fixer.replaceText(matcher, "toHaveStyle"),
            fixer.replaceTextRange(
              [styleName.range[0], styleValue.range[1]],
              `{${getReplacementObjectProperty(styleName)}: ${context
                .getSourceCode()
                .getText(styleValue)}}`
            ),
          ];
        },
      });
    },

    //expect(foo.style).not.toHaveProperty("foo", "bar")
    [`MemberExpression[property.name=style][parent.parent.property.name=not][parent.parent.parent.property.name=toHaveProperty][parent.callee.name=expect]`](
      node
    ) {
      const [styleName, styleValue] =
        node.parent.parent.parent.parent.arguments;
      const matcher = node.parent.parent.parent.property;

      context.report({
        node: node.property,
        message: "Use toHaveStyle instead of asserting on element style",
        fix(fixer) {
          if (
            !styleValue ||
            !["Literal", "TemplateLiteral"].includes(styleValue.type)
          ) {
            return null;
          }
          return [
            fixer.removeRange([node.object.range[1], node.property.range[1]]),
            fixer.replaceText(matcher, "toHaveStyle"),
            fixer.replaceTextRange(
              [styleName.range[0], styleValue.range[1]],
              `{${getReplacementObjectProperty(styleName)}: ${context
                .getSourceCode()
                .getText(styleValue)}}`
            ),
          ];
        },
      });
    },
  };
};
