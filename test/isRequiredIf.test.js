import {expect} from "vitest";
import intus from "../index";
import {isRequiredIf} from "../rules";

it("isRequiredIf", function () {
  let v = intus.validate({age: 12}, {name: [isRequiredIf("age", 12)]});
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    name: "Name is required if age is 12.",
  });

  v = intus.validate(
    {name: "test", age: 12},
    {name: [isRequiredIf("age", 12)]}
  );
  expect(v.passes()).toBe(true);
});

it("isRequiredIf nested", function () {
  let v = intus.validate(
    {nested: {}, age: 12},
    {"nested.field": [isRequiredIf("age", 12)]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.field": "Nested.field is required if age is 12.",
  });
});

it("isRequiredIf nested star", function () {
  let v = intus.validate(
    {nested: [{}], age: 12},
    {"nested.*.field": [isRequiredIf("age", 12)]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.field": "Nested.0.field is required if age is 12.",
  });
});

it("isRequiredIf overwrite field name", function () {
  let v = intus.validate(
    {nested: [{}], age: 12},
    {"nested.*.field": [isRequiredIf("age", 12)]},
    {age: "varsta", "nested.*.field": "something"}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.field": "Something is required if varsta is 12.",
  });
});
