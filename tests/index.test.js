const { rules, configs } = require('../lib/index');

it('should have all the rules', () => {
  expect(rules).toMatchSnapshot();
});

it('should have a recommended config with recommended rules', () => {
  for (const [name, rule] of Object.entries(rules)) {
    if (rule.meta.docs.recommended) {
      expect(configs.recommended.rules).toHaveProperty(name, 'error');
    } else {
      expect(configs.recommended.rules).not.toHaveProperty(name);
    }
  }
});
