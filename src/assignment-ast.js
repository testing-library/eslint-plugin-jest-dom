import { queries } from "./queries";
import { getScope } from './context';

/**
 * Gets the inner relevant node (CallExpression, Identity, et al.) given a generic expression node
 * await someAsyncFunc() => someAsyncFunc()
 * someElement as HTMLDivElement => someElement
 *
 * @param {Object} context - Context for a rule
 * @param {Object} node - Node for a rule
 * @param {Object} expression - An expression node
 * @returns {Object} - A node
 */
export function getInnerNodeFrom(context, node, expression) {
  switch (expression.type) {
    case "Identifier":
      return getAssignmentForIdentifier(context, node, expression.name);
    case "TSAsExpression":
      return getInnerNodeFrom(context, node, expression.expression);
    case "AwaitExpression":
      return getInnerNodeFrom(context, node, expression.argument);
    case "MemberExpression":
      return getInnerNodeFrom(context, node, expression.object);
    default:
      return expression;
  }
}

/**
 * Get the node corresponding to the latest assignment to a variable named `identifierName`
 *
 * @param {Object} context - Context for a rule
 * @param {Object} node - Node for a rule
 * @param {String} identifierName - Name of an identifier
 * @returns {Object} - A node, possibly undefined
 */
export function getAssignmentForIdentifier(context, node, identifierName) {
  const variable = getScope(context, node).set.get(identifierName);

  if (!variable) return;
  const init = variable.defs[0].node.init;

  let assignmentNode;
  if (init) {
    // let foo = bar;
    assignmentNode = getInnerNodeFrom(context, node, init);
  } else {
    // let foo;
    // foo = bar;
    const assignmentRef = variable.references
      .reverse()
      .find((ref) => !!ref.writeExpr);
    if (!assignmentRef) {
      return;
    }
    assignmentNode = getInnerNodeFrom(context, node, assignmentRef.writeExpr);
  }
  return assignmentNode;
}

/**
 * get query node, arg and isDTLQuery flag for a given node.  useful for rules that you only
 * want to apply to dom elements.
 *
 * @param {Object} context - Context for a rule
 * @param {Object} nodeWithValueProp - AST Node to get the query from
 * @returns {Object} - Object with query, queryArg & isDTLQuery
 */
export function getQueryNodeFrom(context, nodeWithValueProp) {
  const queryNode = getInnerNodeFrom(context, nodeWithValueProp, nodeWithValueProp);

  if (!queryNode || !queryNode.callee) {
    return {
      isDTLQuery: false,
      query: null,
      queryArg: null,
    };
  }

  const query =
    queryNode.callee.name ||
    (queryNode.callee.property && queryNode.callee.property.name);
  const queryArg = queryNode.arguments[0] && queryNode.arguments[0].value;
  const isDTLQuery = queries.includes(query);

  return { queryArg, query, isDTLQuery };
}
