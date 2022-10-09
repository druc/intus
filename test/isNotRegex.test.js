import {expect} from "vitest";
import intus from "../index";
import {isNotRegex} from "../rules";

it("isNotRegex", function () {
  let invalid = ["1234567890", 123];
  let valid = ["", null, undefined, "string"];

  invalid.forEach(t => {
    let v = intus.validate({t}, {t: [isNotRegex(/^[0-9]+$/)]});
    expect(v.passes()).toBe(false);
  });

  valid.forEach(t =>
    expect(intus.validate({t}, {t: [isNotRegex(/^[0-9]+$/)]}).passes()).toBe(
      true
    )
  );
});

it("isNotRegex nested", function () {
  let v = intus.validate(
    {nested: {field: "abc"}},
    {"nested.field": [isNotRegex(/^[0-9]+$/)]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: {field: "321"}},
    {"nested.field": [isNotRegex(/^[0-9]+$/)]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.field": "Nested.field must not match regex /^[0-9]+$/.",
  });
});

it("isNotRegex nested star", function () {
  let v = intus.validate(
    {nested: [{field: "abc"}]},
    {"nested.*.field": [isNotRegex(/^[0-9]+$/)]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: [{field: "321"}]},
    {"nested.*.field": [isNotRegex(/^[0-9]+$/)]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.field": "Nested.0.field must not match regex /^[0-9]+$/.",
  });
});
