/**
 * Gets the inner relevant node (CallExpression, Identity, et al.) given a generic expression node
 * await someAsyncFunc() => someAsyncFunc()
 * someElement as HTMLDivElement => someElement
 *
 * @param {Object} expression - An expression node
 * @returns {Object} - A node
 */
export function getInnerNodeFrom(expression) {
  return expression.type === "TSAsExpression"
    ? getInnerNodeFrom(expression.expression)
    : expression.type === "AwaitExpression"
    ? getInnerNodeFrom(expression.argument)
    : expression;
}

/**
 * Get the node corresponding to the latest assignment to a variable named `identifierName`
 *
 * @param {Object} context - Context for a rule
 * @param {String} identifierName - Name of an identifier
 * @returns {Object} - A node, possibly undefined
 */
export function getAssignmentForIdentifier(context, identifierName) {
  const variable = context.getScope().set.get(identifierName);

  if (!variable) return;
  const init = variable.defs[0].node.init;

  let assignmentNode;
  if (init) {
    // let foo = bar;
    assignmentNode = getInnerNodeFrom(init);
  } else {
    // let foo;
    // foo = bar;
    const assignmentRef = variable.references
      .reverse()
      .find((ref) => !!ref.writeExpr);
    if (!assignmentRef) {
      return;
    }
    assignmentNode = getInnerNodeFrom(assignmentRef.writeExpr);
  }
  return assignmentNode;
}
