import {expect} from "vitest";
import intus from "../index";
import {isRequiredUnless} from "../rules";

it("isRequiredUnless", function () {
  let v = intus.validate({a: null, b: 2}, {a: [isRequiredUnless("b", 2)]});
  expect(v.passes()).toBe(true);

  v = intus.validate({a: null, b: false}, {a: [isRequiredUnless("b", false)]});
  expect(v.passes()).toBe(true);

  v = intus.validate({a: null, b: 1}, {a: [isRequiredUnless("b", 2)]});
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({a: "A is required if b is 2."});
});

it("isRequiredUnless nested", function () {
  let v = intus.validate(
    {nested: {a: 1, b: 2}},
    {"nested.a": [isRequiredUnless("nested.b", 2)]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: {a: null, b: 1}},
    {"nested.a": [isRequiredUnless("nested.b", 2)]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.a": "Nested.a is required if nested.b is 2.",
  });
});

it("isRequiredUnless nested star", function () {
  let v = intus.validate(
    {nested: [{a: null, b: 2}]},
    {"nested.*.a": [isRequiredUnless("nested.*.b", 2)]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: [{a: null, b: 1}]},
    {"nested.*.a": [isRequiredUnless("nested.*.b", 2)]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.a": "Nested.0.a is required if nested.0.b is 2.",
  });
});
