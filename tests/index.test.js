const { rules, generateRecommendedConfig, configs } = require('../lib/index');

it('should have all the rules', () => {
  expect(rules).toMatchSnapshot();
});

it('should have a recommended config with recommended rules', () => {
  expect(
    generateRecommendedConfig({
      good: { meta: { docs: { recommended: true } } },
      bad: { meta: { docs: { recommended: false } } },
    })
  ).toEqual({ good: 'error' });
});
