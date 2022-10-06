import {expect} from "vitest";
import intus from "../index";
import {isArray} from "../rules";

it("isArray", function () {
  let invalid = ["a", 1, {}];
  let valid = [[], undefined, "", null];

  invalid.forEach(t => {
    let v = intus.validate({t}, {t: [isArray()]});
    expect(v.passes()).toBe(false);
    expect(v.errors()).toMatchObject({t: "t must be a valid array."});
  });

  valid.forEach(t =>
    expect(intus.validate({t}, {t: [isArray()]}).passes()).toBe(true)
  );
});

it("isArray nested", function () {
  let validation = intus.validate(
    {nested: {field: "not-array"}},
    {"nested.field": [isArray()]}
  );
  expect(validation.passes()).toBe(false);
  expect(validation.errors()).toMatchObject({
    "nested.field": "nested.field must be a valid array.",
  });
});

it("isArray nested star", function () {
  let validation = intus.validate(
    {nested: [{field: "not-array"}]},
    {"nested.*.field": [isArray()]}
  );
  expect(validation.passes()).toBe(false);
  expect(validation.errors()).toMatchObject({
    "nested.0.field": "nested.0.field must be a valid array.",
  });
});
