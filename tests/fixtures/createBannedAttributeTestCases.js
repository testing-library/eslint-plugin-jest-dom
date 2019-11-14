module.exports = ({ preferred, negatedPreferred, attribute }) => {
  let doubleNegativeCases = [];
  if (negatedPreferred.startsWith('toBe')) {
    doubleNegativeCases = [
      {
        code: `expect(element).not.${negatedPreferred}`,
        errors: [
          {
            message: `Use ${preferred} instead of not.${negatedPreferred}`,
          },
        ],
        output: `expect(element).${preferred}`,
      },
      {
        code: `expect(element).not.${preferred}`,
        errors: [
          {
            message: `Use ${negatedPreferred} instead of not.${preferred}`,
          },
        ],
        output: `expect(element).${negatedPreferred}`,
      },
    ];
  }
  let directChecks = [];
  if (!/-/.test(attribute)) {
    directChecks = [
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
  }
  return {
    valid: [
      `expect(element).not.toHaveProperty('value', 'foo')`,
      `expect(element).${preferred}`,
      `expect(element).${negatedPreferred}`,
      `expect(element).toHaveProperty('value', 'bar')`,
    ],
    invalid: [
      ...doubleNegativeCases,
      ...directChecks,
      {
        code: `expect(element).toHaveProperty('${attribute}', true)`,
        errors: [
          {
            message: `Use ${preferred} instead of toHaveProperty('${attribute}', true)`,
          },
        ],
        output: `expect(element).${preferred}`,
      },
      {
        code: `expect(element).toHaveProperty('${attribute}', false)`,
        errors: [
          {
            message: `Use ${negatedPreferred} instead of toHaveProperty('${attribute}', false)`,
          },
        ],
        output: `expect(element).${negatedPreferred}`,
      },
      {
        code: `expect(element).toHaveAttribute('${attribute}', false)`,
        errors: [
          {
            message: `Use ${negatedPreferred} instead of toHaveAttribute('${attribute}', false)`,
          },
        ],
        output: `expect(element).${negatedPreferred}`,
      },
      {
        code: `expect(element).toHaveProperty('${attribute}')`,
        errors: [
          {
            message: `Use ${preferred} instead of toHaveProperty('${attribute}')`,
          },
        ],
        output: `expect(element).${preferred}`,
      },
      {
        code: `expect(element).toHaveAttribute('${attribute}')`,
        errors: [
          {
            message: `Use ${preferred} instead of toHaveAttribute('${attribute}')`,
          },
        ],
        output: `expect(element).${preferred}`,
      },
      {
        code: `expect(element).not.toHaveAttribute('${attribute}')`,
        errors: [
          {
            message: `Use ${negatedPreferred} instead of not.toHaveAttribute('${attribute}')`,
          },
        ],
        output: `expect(element).${negatedPreferred}`,
      },
      {
        code: `expect(element).not.toHaveProperty('${attribute}')`,
        errors: [
          {
            message: `Use ${negatedPreferred} instead of not.toHaveProperty('${attribute}')`,
          },
        ],
        output: `expect(element).${negatedPreferred}`,
      },
      {
        code: `expect(element).toHaveAttribute("${attribute}", "")`,
        errors: [
          {
            message: `Use ${preferred} instead of toHaveAttribute("${attribute}", "")`,
          },
        ],
        output: `expect(element).${preferred}`,
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
      // {
      //   code: `expect(getByText('foo').getAttribute('${attribute}')).toBeTruthy()`,
      //   errors: [
      //     {
      //       message: `Use ${preferred} instead of .${attribute}`,
      //     },
      //   ],
      //   output: `expect(getByText('foo')).${[preferred]}`,
      // },
    ],
  };
};
