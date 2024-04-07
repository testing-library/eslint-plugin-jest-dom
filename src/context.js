export function getSourceCode(context) {
  if ('sourceCode' in context) {
    return context.sourceCode;
  }

  return context.getSourceCode();
}

export function getScope(context, node) {
  const sourceCode = getSourceCode(context);

  if (sourceCode && sourceCode.getScope) {
    return sourceCode.getScope(node);
  }

  return context.getScope();
}
