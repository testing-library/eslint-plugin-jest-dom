/**
 * @fileoverview prefer toHaveAttribute over checking  getAttribute/hasAttribute
 * @author Ben Monro
 */

import { getQueryNodeFrom } from "../assignment-ast";
import { getSourceCode } from '../context';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export const meta = {
  docs: {
    category: "Best Practices",
    description: "prefer toHaveValue over checking element.value",
    url: "prefer-to-have-value",
    recommended: true,
  },
  fixable: "code",
  messages: {
    "use-to-have-value": `Prefer .toHaveValue() over other attribute checks`,
  },
};
const messageId = "use-to-have-value";

export const create = (context) => {
  function isValidQueryNode(nodeWithValueProp) {
    const { query, queryArg, isDTLQuery } = getQueryNodeFrom(
      context,
      nodeWithValueProp
    );
    return (
      !!query &&
      isDTLQuery &&
      !!query.match(/^(get|find|query)(All)?ByRole$/) &&
      ["textbox", "dropdown"].includes(queryArg)
    );
  }
  return {
    // expect(element.value).toBe('foo') / toEqual / toStrictEqual
    // expect(<query>.value).toBe('foo') / toEqual / toStrictEqual
    // expect((await <query>).value).toBe('foo') / toEqual / toStrictEqual
    [`CallExpression[callee.property.name=/to(Be|(Strict)?Equal)$/][callee.object.arguments.0.property.name=value][callee.object.callee.name=expect]`](
      node
    ) {
      const valueProp = node.callee.object.arguments[0].property;
      const matcher = node.callee.property;
      const queryNode = node.callee.object.arguments[0].object;

      if (isValidQueryNode(queryNode)) {
        context.report({
          messageId,
          node,
          fix(fixer) {
            return [
              fixer.remove(getSourceCode(context).getTokenBefore(valueProp)),
              fixer.remove(valueProp),
              fixer.replaceText(matcher, "toHaveValue"),
            ];
          },
        });
      }
    },

    // expect(element.value).not.toBe('foo') / toEqual / toStrictEqual
    // expect(<query>.value).not.toBe('foo') / toEqual / toStrictEqual
    // expect((await <query>).value).not.toBe('foo') / toEqual / toStrictEqual
    [`CallExpression[callee.property.name=/to(Be|(Strict)?Equal)$/][callee.object.object.callee.name=expect][callee.object.property.name=not][callee.object.object.arguments.0.property.name=value]`](
      node
    ) {
      const queryNode = node.callee.object.object.arguments[0].object;
      const valueProp = node.callee.object.object.arguments[0].property;
      const matcher = node.callee.property;

      if (isValidQueryNode(queryNode)) {
        context.report({
          messageId,
          node,
          fix(fixer) {
            return [
              fixer.removeRange([
                getSourceCode(context).getTokenBefore(valueProp).range[0],
                valueProp.range[1],
              ]),
              fixer.replaceText(matcher, "toHaveValue"),
            ];
          },
        });
      }
    },

    //expect(element).toHaveAttribute('value', 'foo')  / Property
    [`CallExpression[callee.property.name=/toHave(Attribute|Property)/][arguments.0.value=value][arguments.1][callee.object.callee.name=expect], CallExpression[callee.property.name=/toHave(Attribute|Property)/][arguments.0.value=value][arguments.1][callee.object.object.callee.name=expect][callee.object.property.name=not]`](
      node
    ) {
      const matcher = node.callee.property;
      const [prop, value] = node.arguments;

      context.report({
        messageId,
        node,

        fix(fixer) {
          return [
            fixer.replaceText(matcher, "toHaveValue"),
            fixer.removeRange([prop.range[0], value.range[0]]),
          ];
        },
      });
    },
  };
};
