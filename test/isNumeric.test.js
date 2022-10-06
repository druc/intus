import {expect} from "vitest";
import intus from "../index";
import {isNumeric} from "../rules";

it("isNumeric", function () {
  let invalid = ["a"];
  let valid = [1, "1", 1.5, "2.55", "2.0", "", null, undefined];

  invalid.forEach(t => {
    let v = intus.validate({t}, {t: [isNumeric()]});
    expect(v.passes()).toBe(false);
    expect(v.errors()).toMatchObject({t: "t must be a number."});
  });

  valid.forEach(t =>
    expect(intus.validate({t}, {t: [isNumeric()]}).passes()).toBe(true)
  );
});

it("isNumeric nested", function () {
  let validation = intus.validate(
    {nested: {field: "NaN"}},
    {"nested.field": [isNumeric()]}
  );
  expect(validation.passes()).toBe(false);
  expect(validation.errors()).toMatchObject({
    "nested.field": "nested.field must be a number.",
  });
});

it("isNumeric nested star", function () {
  let validation = intus.validate(
    {nested: [{field: "NaN"}]},
    {"nested.*.field": [isNumeric()]}
  );
  expect(validation.passes()).toBe(false);
  expect(validation.errors()).toMatchObject({
    "nested.0.field": "nested.0.field must be a number.",
  });
});
