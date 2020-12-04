/**
 * @fileoverview prefer toBeInTheDocument over checking getAttribute/hasAttribute
 * @author Anton Niklasson
 */

import { queries } from "../queries";

export const meta = {
  type: "suggestion",
  docs: {
    category: "Best Practices",
    description:
      "Prefer .toBeInTheDocument() for asserting the existence of a DOM node",
    url: "prefer-in-document",
    recommended: true,
  },
  fixable: "code",
  messages: {
    "use-document": `Prefer .toBeInTheDocument() for asserting DOM node existence`,
  },
};

function isAntonymMatcher(matcherNode, matcherArguments) {
  return (
    matcherNode.name === "toBeNull" ||
    (matcherNode.name === "toHaveLength" && matcherArguments[0].value === 0)
  );
}

export const create = (context) => {
  const alternativeMatchers = /(toHaveLength|toBeDefined|toBeNull)/;
  function check({
    queryNode,
    matcherNode,
    matcherArguments,
    negatedMatcher,
    expect,
  }) {
    if (!queryNode || (!queryNode.name && !queryNode.property)) return;
    // toHaveLength() is only invalid with 0 or 1
    if (
      matcherNode.name === "toHaveLength" &&
      (matcherArguments[0].type !== "Literal" || matcherArguments[0].value > 1)
    ) {
      return;
    }

    const query = queryNode.name || queryNode.property.name;

    if (queries.includes(query)) {
      context.report({
        node: matcherNode,
        messageId: "use-document",
        loc: matcherNode.loc,
        fix(fixer) {
          const operations = [];

          // Remove any arguments in the matcher
          for (const argument of Array.from(matcherArguments)) {
            operations.push(fixer.remove(argument));
          }
          if (
            matcherNode.name === "toHaveLength" &&
            matcherArguments[0].value === 1 &&
            query.indexOf("All") > 0
          ) {
            operations.push(
              fixer.replaceText(
                queryNode.property || queryNode,
                query.replace("All", "")
              )
            );
          }
          // Flip the .not if necessary
          if (isAntonymMatcher(matcherNode, matcherArguments)) {
            if (negatedMatcher) {
              operations.push(
                fixer.replaceTextRange(
                  [expect.range[1], matcherNode.range[1]],
                  ".toBeInTheDocument"
                )
              );

              return operations;
            } else {
              operations.push(fixer.insertTextBefore(matcherNode, "not."));
            }
          }

          // Replace the actual matcher
          operations.push(fixer.replaceText(matcherNode, "toBeInTheDocument"));

          return operations;
        },
      });
    }
  }

  function getQueryNodeFrom(expression) {
    return expression.type === "TSAsExpression"
      ? getQueryNodeFrom(expression.expression)
      : expression.type === "AwaitExpression"
      ? getQueryNodeFrom(expression.argument)
      : expression.callee;
  }

  function getQueryNodeFromAssignment(identifierName) {
    const variable = context.getScope().set.get(identifierName);
    if (!variable) return;
    const init = variable.defs[0].node.init;

    let queryNode;
    if (init) {
      // let foo = screen.<query>();
      queryNode = getQueryNodeFrom(init);
    } else {
      // let foo;
      // foo = screen.<query>();
      const assignmentRef = variable.references
        .reverse()
        .find((ref) => !!ref.writeExpr);
      if (!assignmentRef) {
        return;
      }
      const assignment = assignmentRef.writeExpr;
      queryNode = getQueryNodeFrom(assignment);
    }
    return queryNode;
  }
  return {
    // expect(<query>).not.<matcher>
    [`CallExpression[callee.object.object.callee.name='expect'][callee.object.property.name='not'][callee.property.name=${alternativeMatchers}], CallExpression[callee.object.callee.name='expect'][callee.object.property.name='not'][callee.object.arguments.0.argument.callee.name=${alternativeMatchers}]`](
      node
    ) {
      const arg = node.callee.object.object.arguments[0];
      const queryNode =
        arg.type === "AwaitExpression" ? arg.argument.callee : arg.callee;
      const matcherNode = node.callee.property;
      const matcherArguments = node.arguments;

      const expect = node.callee.object.object;
      check({
        negatedMatcher: true,
        queryNode,
        matcherNode,
        matcherArguments,
        expect,
      });
    },
    // // const foo = <query> expect(foo).not.<matcher>
    [`MemberExpression[object.object.callee.name=expect][object.property.name=not][property.name=${alternativeMatchers}][object.object.arguments.0.type=Identifier]`](
      node
    ) {
      const queryNode = getQueryNodeFromAssignment(
        node.object.object.arguments[0].name
      );
      const matcherNode = node.property;

      const matcherArguments = node.parent.arguments;

      const expect = node.object.object;

      check({
        negatedMatcher: true,
        queryNode,
        matcherNode,
        matcherArguments,
        expect,
      });
    },
    // const foo = <query> expect(foo).<matcher>
    [`MemberExpression[object.callee.name=expect][property.name=${alternativeMatchers}][object.arguments.0.type=Identifier]`](
      node
    ) {
      const queryNode = getQueryNodeFromAssignment(
        node.object.arguments[0].name
      );
      const matcherNode = node.property;

      const matcherArguments = node.parent.arguments;

      check({
        negatedMatcher: false,
        queryNode,
        matcherNode,
        matcherArguments,
      });
    },
    // expect(await <query>).<matcher>
    // expect(<query>).<matcher>
    [`CallExpression[callee.object.callee.name='expect'][callee.property.name=${alternativeMatchers}], CallExpression[callee.object.callee.name='expect'][callee.object.arguments.0.argument.callee.name=${alternativeMatchers}]`](
      node
    ) {
      const arg = node.callee.object.arguments[0];
      const queryNode =
        arg.type === "AwaitExpression" ? arg.argument.callee : arg.callee;
      const matcherNode = node.callee.property;
      const matcherArguments = node.arguments;

      check({
        negatedMatcher: false,
        queryNode,
        matcherNode,
        matcherArguments,
      });
    },
  };
};
