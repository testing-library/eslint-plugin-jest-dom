export default ({ preferred, negatedPreferred, mixedPreferred, attribute }) => {
  // covers toBeDisabled / toBeEnabled
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
        {
          code: `const el = screen.getByRole("button"); expect(el).not.${preferred}`,
          errors: [
            {
              message: `Use ${negatedPreferred} instead of not.${preferred}`,
            },
          ],
          output: `const el = screen.getByRole("button"); expect(el).${negatedPreferred}`,
        },
      ]
    : [];

  // covers not aria-* type attributes
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
          output: `expect(getByText('foo')).${preferred}`,
        },
        {
          code: `expect(getByText('foo').${attribute}).toBeFalsy()`,
          errors: [
            {
              message: `Use ${negatedPreferred} instead of checking .${attribute} directly`,
            },
          ],
          output: `expect(getByText('foo')).${negatedPreferred}`,
        },
        {
          code: `const el = getByText('foo'); expect(el.${attribute}).toBe(true)`,
          errors: [
            {
              message: `Use ${preferred} instead of checking .${attribute} directly`,
            },
          ],
          output: `const el = getByText('foo'); expect(el).${preferred}`,
        },
        {
          code: `const el = getByRole('button'); expect(el.${attribute}).toBe(true)`,
          errors: [
            {
              message: `Use ${preferred} instead of checking .${attribute} directly`,
            },
          ],
          output: `const el = getByRole('button'); expect(el).${preferred}`,
        },
        // A parenthesized element expression. Parentheses are not AST nodes, so
        // the object's range ends before the `)` and removing from there eats it.
        {
          code: `const el = getByRole('button'); expect((el).${attribute}).toBe(true)`,
          errors: [
            {
              message: `Use ${preferred} instead of checking .${attribute} directly`,
            },
          ],
          output: `const el = getByRole('button'); expect((el)).${preferred}`,
        },
      ];

  // covers partial matchers for aria-<attribute>=mixed
  const mixedChecks = mixedPreferred
    ? [
        {
          code: `const el = screen.getByText("foo"); expect(el).toHaveProperty('${attribute}', 'mixed')`,
          errors: [
            {
              message: `Use ${mixedPreferred} instead of toHaveProperty('${attribute}', 'mixed')`,
            },
          ],
          output: `const el = screen.getByText("foo"); expect(el).${mixedPreferred}`,
        },
        {
          code: `const el = screen.getByText("foo"); expect(el).toHaveAttribute('${attribute}', 'mixed')`,
          errors: [
            {
              message: `Use ${mixedPreferred} instead of toHaveAttribute('${attribute}', 'mixed')`,
            },
          ],
          output: `const el = screen.getByText("foo"); expect(el).${mixedPreferred}`,
        },
        {
          code: `const el = screen.getByText("foo"); expect(el).not.toHaveAttribute('${attribute}', 'mixed')`,
          errors: [
            {
              message: `Use not.${mixedPreferred} instead of not.toHaveAttribute('${attribute}', 'mixed')`,
            },
          ],
          output: `const el = screen.getByText("foo"); expect(el).not.${mixedPreferred}`,
        },
        {
          code: `const el = screen.getByText("foo"); expect(el).not.toHaveAttribute('${attribute}', 'Mixed')`,
          errors: [
            {
              message: `Use not.${mixedPreferred} instead of not.toHaveAttribute('${attribute}', 'Mixed')`,
            },
          ],
          output: `const el = screen.getByText("foo"); expect(el).not.${mixedPreferred}`,
        },
        {
          code: `const el = screen.getByText("foo"); expect(el).not.toHaveProperty('${attribute}', 'mixed')`,
          errors: [
            {
              message: `Use not.${mixedPreferred} instead of not.toHaveProperty('${attribute}', 'mixed')`,
            },
          ],
          output: `const el = screen.getByText("foo"); expect(el).not.${mixedPreferred}`,
        },
        {
          code: `expect(getByText("foo")).toHaveAttribute("${attribute}", "mixed")`,
          errors: [
            {
              message: `Use ${mixedPreferred} instead of toHaveAttribute("${attribute}", "mixed")`,
            },
          ],
          output: `expect(getByText("foo")).${mixedPreferred}`,
        },
        {
          code: `expect(getByText("foo")).not.toHaveProperty("${attribute}", "mixed")`,
          errors: [
            {
              message: `Use not.${mixedPreferred} instead of not.toHaveProperty("${attribute}", "mixed")`,
            },
          ],
          output: `expect(getByText("foo")).not.${mixedPreferred}`,
        },
        {
          code: `const el = getByRole("button", { name: 'My Button' }); expect(el).toHaveProperty('${attribute}', 'mixed')`,
          errors: [
            {
              message: `Use ${mixedPreferred} instead of toHaveProperty('${attribute}', 'mixed')`,
            },
          ],
          output: `const el = getByRole("button", { name: 'My Button' }); expect(el).${mixedPreferred}`,
        },
      ]
    : [];

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
      ...(mixedPreferred
        ? [
            `expect(getFoo().${attribute}).toBe("mixed")`,
            `expect(getFoo().${attribute}).not.toBe("mixed")`,
            `const el = screen.getByText("foo"); expect(el).${mixedPreferred}`,
            `const el = screen.getByText("foo"); expect(el).not.${mixedPreferred}`,
            `const el = foo.bar(); expect(el).toHaveProperty("${attribute}", 'mixed')`,
          ]
        : []),
    ],
    invalid: [
      ...doubleNegativeCases,
      ...directChecks,
      ...mixedChecks,
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
            message: `Use ${negatedPreferred} instead of not.toHaveProperty("${attribute}")`,
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
      {
        code: `const el = screen.getByText("foo"); expect(el).not.toHaveProperty('${attribute}', foo)`,
        errors: [
          {
            message: `Use ${negatedPreferred} instead of not.toHaveProperty('${attribute}', foo)`,
          },
        ],
        output: `const el = screen.getByText("foo"); expect(el).${negatedPreferred}`,
      },
      {
        code: `const el = getByRole("button", { name: 'My Button' }); expect(el).toHaveProperty('${attribute}', foo)`,
        errors: [
          {
            message: `Use ${preferred} instead of toHaveProperty('${attribute}', foo)`,
          },
        ],
      },
    ],
  };
};
