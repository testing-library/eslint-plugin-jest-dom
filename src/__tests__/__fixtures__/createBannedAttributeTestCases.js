/* eslint-disable max-lines-per-function */

export default ({ preferred, negatedPreferred, attribute }) => {
  const doubleNegativeCases = negatedPreferred.startsWith("toBe")
    ? [
        {
          code: `expect().not.${negatedPreferred}`,
          errors: [
            {
              message: `Use ${preferred} instead of not.${negatedPreferred}`,
            },
          ],
          output: `expect().${preferred}`,
        },
        {
          code: `const el = screen.getByText("foo"); expect(el).not.${negatedPreferred}`,
          errors: [
            {
              message: `Use ${preferred} instead of not.${negatedPreferred}`,
            },
          ],
          output: `const el = screen.getByText("foo"); expect(el).${preferred}`,
        },
        {
          code: `expect(getByText("foo")).not.${negatedPreferred}`,
          errors: [
            {
              message: `Use ${preferred} instead of not.${negatedPreferred}`,
            },
          ],
          output: `expect(getByText("foo")).${preferred}`,
        },
        {
          code: `const el = screen.getByText("foo"); expect(el).not.${preferred}`,
          errors: [
            {
              message: `Use ${negatedPreferred} instead of not.${preferred}`,
            },
          ],
          output: `const el = screen.getByText("foo"); expect(el).${negatedPreferred}`,
        },
      ]
    : [];
  const directChecks = /-/.test(attribute)
    ? []
    : [
        {
          code: `expect(getByText('foo').${attribute}).toBeTruthy()`,
          errors: [
            {
              message: `Use ${preferred} instead of checking .${attribute} directly`,
            },
          ],
          output: `expect(getByText('foo')).${[preferred]}`,
        },
        {
          code: `expect(getByText('foo').${attribute}).toBeFalsy()`,
          errors: [
            {
              message: `Use ${negatedPreferred} instead of checking .${attribute} directly`,
            },
          ],
          output: `expect(getByText('foo')).${[negatedPreferred]}`,
        },
        {
          code: `expect(getByText('foo').${attribute}).toBe(true)`,
          errors: [
            {
              message: `Use ${preferred} instead of checking .${attribute} directly`,
            },
          ],
          output: `expect(getByText('foo')).${[preferred]}`,
        },
      ];

  return {
    valid: [
      `expect().not.toHaveProperty('value', 'foo')`,
      `const el = screen.getByText("foo"); expect(el).not.toHaveProperty('value', 'foo')`,
      `const el = screen.getByText("foo"); expect(el).${preferred}`,
      `const el = screen.getByText("foo"); expect(el).${negatedPreferred}`,
      `const el = screen.getByText("foo"); expect(el).toHaveProperty('value', 'bar')`,
      `const el = foo.bar(); expect(el).toHaveProperty("${attribute}", true)`,
      `expect(getFoo().${attribute}).toBe("bar")`,
      `expect(getFoo().${attribute}).not.toBe("bar")`,
    ],
    invalid: [
      ...doubleNegativeCases,
      ...directChecks,
      {
        code: `const el = screen.getByText("foo"); expect(el).toHaveProperty('${attribute}', true)`,
        errors: [
          {
            message: `Use ${preferred} instead of toHaveProperty('${attribute}', true)`,
          },
        ],
        output: `const el = screen.getByText("foo"); expect(el).${preferred}`,
      },
      {
        code: `const el = screen.getByText("foo"); expect(el).toHaveProperty('${attribute}', false)`,
        errors: [
          {
            message: `Use ${negatedPreferred} instead of toHaveProperty('${attribute}', false)`,
          },
        ],
        output: `const el = screen.getByText("foo"); expect(el).${negatedPreferred}`,
      },
      {
        code: `const el = screen.getByText("foo"); expect(el).toHaveAttribute('${attribute}', false)`,
        errors: [
          {
            message: `Use ${negatedPreferred} instead of toHaveAttribute('${attribute}', false)`,
          },
        ],
        output: `const el = screen.getByText("foo"); expect(el).${negatedPreferred}`,
      },
      {
        code: `const el = screen.getByText("foo"); expect(el).toHaveProperty('${attribute}')`,
        errors: [
          {
            message: `Use ${preferred} instead of toHaveProperty('${attribute}')`,
          },
        ],
        output: `const el = screen.getByText("foo"); expect(el).${preferred}`,
      },
      {
        code: `const el = screen.getByText("foo"); expect(el).toHaveAttribute('${attribute}')`,
        errors: [
          {
            message: `Use ${preferred} instead of toHaveAttribute('${attribute}')`,
          },
        ],
        output: `const el = screen.getByText("foo"); expect(el).${preferred}`,
      },
      {
        code: `const el = screen.getByText("foo"); expect(el).not.toHaveAttribute('${attribute}')`,
        errors: [
          {
            message: `Use ${negatedPreferred} instead of not.toHaveAttribute('${attribute}')`,
          },
        ],
        output: `const el = screen.getByText("foo"); expect(el).${negatedPreferred}`,
      },
      {
        code: `const el = screen.getByText("foo"); expect(el).not.toHaveProperty('${attribute}')`,
        errors: [
          {
            message: `Use ${negatedPreferred} instead of not.toHaveProperty('${attribute}')`,
          },
        ],
        output: `const el = screen.getByText("foo"); expect(el).${negatedPreferred}`,
      },
      {
        code: `const el = screen.getByText("foo"); expect(el).toHaveAttribute("${attribute}", "")`,
        errors: [
          {
            message: `Use ${preferred} instead of toHaveAttribute("${attribute}", "")`,
          },
        ],
        output: `const el = screen.getByText("foo"); expect(el).${preferred}`,
      },
      {
        code: `expect(getByText("foo")).toHaveAttribute("${attribute}", "true")`,
        errors: [
          {
            message: `Use ${preferred} instead of toHaveAttribute("${attribute}", "true")`,
          },
        ],
        output: `expect(getByText("foo")).${preferred}`,
      },
      {
        code: `expect(getByText("foo")).toHaveAttribute("${attribute}", "false")`,
        errors: [
          {
            message: `Use ${negatedPreferred} instead of toHaveAttribute("${attribute}", "false")`,
          },
        ],
        output: `expect(getByText("foo")).${negatedPreferred}`,
      },
      {
        code: `expect(getByText("foo")).toHaveAttribute("${attribute}", "")`,
        errors: [
          {
            message: `Use ${preferred} instead of toHaveAttribute("${attribute}", "")`,
          },
        ],
        output: `expect(getByText("foo")).${preferred}`,
      },
      {
        code: `expect(getByText("foo")).not.toHaveProperty("${attribute}")`,
        errors: [
          {
            message: `Use ${negatedPreferred} instead of not.toHaveProperty('${attribute}')`,
          },
        ],
        output: `expect(getByText("foo")).${negatedPreferred}`,
      },
      {
        code: `const el = screen.getByText("foo"); expect(el).toHaveProperty('${attribute}', foo)`,
        errors: [
          {
            message: `Use ${preferred} instead of toHaveProperty('${attribute}', foo)`,
          },
        ],
      },
    ],
  };
};
