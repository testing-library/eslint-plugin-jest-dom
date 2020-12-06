/**
 * @fileoverview prefer toHaveAttribute over checking  getAttribute/hasAttribute
 * @author Ben Monro
 */

import { queries } from "../queries";
import { getInnerNodeFrom, getAssignmentForIdentifier } from "../utils";

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
  function validateQueryNode(nodeWithValueProp) {
    const queryNode =
      nodeWithValueProp.type === "Identifier"
        ? getAssignmentForIdentifier(context, nodeWithValueProp.name)
        : getInnerNodeFrom(nodeWithValueProp);

    if (!queryNode || !queryNode.callee) {
      return {
        isValidQuery: false,
        isValidElement: false,
      };
    }

    const query = queryNode.callee.name || queryNode.callee.property.name;
    const queryArg = queryNode.arguments[0] && queryNode.arguments[0].value;
    const isValidQuery = queries.includes(query);
    const isValidElement =
      query.match(/^(get|find|query)ByRole$/) &&
      ["textbox", "dropdown"].includes(queryArg);
    return { isValidQuery, isValidElement };
  }
  return {
    // expect(element.value).toBe('foo') / toEqual / toStrictEqual
    // expect(<query>.value).toBe('foo') / toEqual / toStrictEqual
    // expect((await <query>).value).toBe('foo') / toEqual / toStrictEqual
    [`CallExpression[callee.property.name=/to(Be|(Strict)?Equal)$/][callee.object.arguments.0.property.name=value][callee.object.callee.name=expect]`](
      node
    ) {
      const { isValidQuery, isValidElement } = validateQueryNode(
        node.callee.object.arguments[0].object
      );
      function fix(fixer) {
        return [
          fixer.removeRange([
            node.callee.object.arguments[0].property.range[0] - 1,
            node.callee.object.arguments[0].property.range[1],
          ]),
          fixer.replaceText(node.callee.property, "toHaveValue"),
        ];
      }
      if (isValidQuery) {
        context.report({
          messageId,
          node,
          fix: isValidElement ? fix : undefined,
          suggest: isValidElement
            ? undefined
            : [
                {
                  desc: `Replace ${node.callee.property.name} with toHaveValue`,
                  fix,
                },
              ],
        });
      }
    },

    // expect(element.value).not.toBe('foo') / toEqual / toStrictEqual
    // expect(<query>.value).not.toBe('foo') / toEqual / toStrictEqual
    // expect((await <query>).value).not.toBe('foo') / toEqual / toStrictEqual
    [`CallExpression[callee.property.name=/to(Be|(Strict)?Equal)$/][callee.object.object.callee.name=expect][callee.object.property.name=not][callee.object.object.arguments.0.property.name=value]`](
      node
    ) {
      const { isValidQuery, isValidElement } = validateQueryNode(
        node.callee.object.object.arguments[0].object
      );
      function fix(fixer) {
        return [
          fixer.removeRange([
            node.callee.object.object.arguments[0].property.range[0] - 1,
            node.callee.object.object.arguments[0].property.range[1],
          ]),
          fixer.replaceText(node.callee.property, "toHaveValue"),
        ];
      }
      if (isValidQuery) {
        context.report({
          messageId,
          node,
          fix: isValidElement ? fix : undefined,
          suggest: isValidElement
            ? undefined
            : [
                {
                  desc: `Replace ${node.callee.property.name} with toHaveValue`,
                  fix,
                },
              ],
        });
      }
    },

    //expect(element).toHaveAttribute('value', 'foo')  / Property
    [`CallExpression[callee.property.name=/toHave(Attribute|Property)/][arguments.0.value=value][arguments.1][callee.object.callee.name=expect], CallExpression[callee.property.name=/toHave(Attribute|Property)/][arguments.0.value=value][arguments.1][callee.object.object.callee.name=expect][callee.object.property.name=not]`](
      node
    ) {
      context.report({
        messageId,
        node,

        fix(fixer) {
          return [
            fixer.replaceText(node.callee.property, "toHaveValue"),
            fixer.removeRange([
              node.arguments[0].range[0],
              node.arguments[1].range[0],
            ]),
          ];
        },
      });
    },
  };
};
