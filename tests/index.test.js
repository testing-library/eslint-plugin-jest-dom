const { rules } = require('../lib/index');

it('should have all the rules', () => {
  expect(rules).toMatchSnapshot();
});
