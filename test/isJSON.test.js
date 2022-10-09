import {expect} from "vitest";
import intus from "../index";
import {isJSON} from "../rules";

it("isJSON", function () {
  let invalid = [1, "nojson"];
  let valid = ["[]", "{}", '{"a": 1}', undefined, null, ""];

  invalid.forEach(t => {
    let v = intus.validate({t: t}, {t: [isJSON()]});
    expect(v.passes()).toBe(false);
    expect(v.errors()).toMatchObject({t: "T must be a valid JSON."});
  });
  valid.forEach(t =>
    expect(intus.validate({t: t}, {t: [isJSON()]}).passes()).toBe(true)
  );
});

it("isJSON nested", function () {
  let v = intus.validate({nested: {field: "{}"}}, {"nested.field": [isJSON()]});
  expect(v.passes()).toBe(true);

  v = intus.validate({nested: {field: "not"}}, {"nested.field": [isJSON()]});
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.field": "Nested.field must be a valid JSON.",
  });
});

it("isJSON nested star", function () {
  let v = intus.validate(
    {nested: [{field: "{}"}]},
    {"nested.*.field": [isJSON()]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: [{field: "not"}]},
    {"nested.*.field": [isJSON()]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.field": "Nested.0.field must be a valid JSON.",
  });
});
