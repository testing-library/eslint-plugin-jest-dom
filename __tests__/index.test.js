const { rules, generateRecommendedConfig } = require("../src/index");

it("should have all the rules", () => {
  expect(rules).toMatchSnapshot();
});

it("should have a recommended config with recommended rules", () => {
  expect(
    generateRecommendedConfig({
      good: { meta: { docs: { recommended: true } } },
      bad: { meta: { docs: { recommended: false } } }
    })
  ).toEqual({ "jest-dom/good": "error" });
});
