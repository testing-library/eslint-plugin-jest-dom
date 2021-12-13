import { generateRecommendedConfig, rules } from "../";

it("should have all the rules", () => {
  expect(Object.keys(rules).length).toBeGreaterThan(0);
});

it.each(Object.keys(rules))("%s should export required fields", (ruleName) => {
  const rule = rules[ruleName];
  expect(rule).toHaveProperty("create", expect.any(Function));
  expect(rule.meta.docs.url).not.toBe("");
  expect(rule.meta.docs.category).toBe("Best Practices");
  expect(rule.meta.docs.description).not.toBe("");
});

it("should have a recommended config with recommended rules", () => {
  expect(
    generateRecommendedConfig({
      good: { meta: { docs: { recommended: true } } },
      bad: { meta: { docs: { recommended: false } } },
    })
  ).toEqual({ "jest-dom/good": "error" });
});
