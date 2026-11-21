/* istanbul ignore next */
export function getSourceCode(context) {
  if ("sourceCode" in context) {
    return context.sourceCode;
  }

  return context.getSourceCode();
}

/**
 * The range covering `.property`, starting at the dot rather than at the end of
 * the object. Parentheses are not AST nodes, so for `(el).disabled` the object's
 * range ends before the `)`, and a removal starting there takes the `)` with it
 * and leaves unparseable output.
 *
 * @param context
 * @param property the MemberExpression's property node
 *
 * @return {[number, number]}
 */
export function propertyAccessRange(context, property) {
  const dot = getSourceCode(context).getTokenBefore(
    property,
    (token) => token.value === ".",
  );

  return [dot.range[0], property.range[1]];
}

/* istanbul ignore next */
export function getScope(context, node) {
  const sourceCode = getSourceCode(context);

  if (sourceCode && sourceCode.getScope) {
    return sourceCode.getScope(node);
  }

  return context.getScope();
}
