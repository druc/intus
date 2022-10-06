import {expect} from "vitest";
import intus from "../index";
import {isRegex} from "../rules";

it("isRegex", function () {
  let invalid = ["a"];
  let valid = ["", null, undefined, "1234567890", 123];

  invalid.forEach(t => {
    let v = intus.validate({t}, {t: [isRegex(/^[0-9]+$/)]});
    expect(v.passes()).toBe(false);
    expect(v.errors()).toMatchObject({t: "t must match regex /^[0-9]+$/."});
  });

  valid.forEach(t =>
    expect(intus.validate({t}, {t: [isRegex(/^[0-9]+$/)]}).passes()).toBe(true)
  );
});

it("isRegex nested", function () {
  let v = intus.validate(
    {nested: {field: "0123"}},
    {"nested.field": [isRegex(/^[0-9]+$/)]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: {field: "NaN"}},
    {"nested.field": [isRegex(/^[0-9]+$/)]}
  );

  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.field": "nested.field must match regex /^[0-9]+$/.",
  });
});

it("isRegex nested star", function () {
  let v = intus.validate(
    {nested: [{field: "0123"}]},
    {"nested.*.field": [isRegex(/^[0-9]+$/)]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: [{field: "NaN"}]},
    {"nested.*.field": [isRegex(/^[0-9]+$/)]}
  );

  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.field": "nested.0.field must match regex /^[0-9]+$/.",
  });
});
