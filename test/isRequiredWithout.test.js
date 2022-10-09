import {expect} from "vitest";
import intus from "../index";
import {isRequiredWithout} from "../rules";

it("isRequiredWithout", function () {
  let v = intus.validate({a: 1, b: 2}, {a: [isRequiredWithout("b")]});
  expect(v.passes()).toBe(true);

  v = intus.validate({a: null, b: 2}, {a: [isRequiredWithout("b")]});
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {a: null, b: 2},
    {a: [isRequiredWithout("b", "e", "c", "d")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate({a: null}, {a: [isRequiredWithout("b")]});
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({a: "A is required when b is missing."});
});

it("isRequiredWithout multiple", function () {
  let v = intus.validate(
    {a: null, b: 2},
    {a: [isRequiredWithout("b", "c", "d")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {a: null, b: null},
    {a: [isRequiredWithout("b", "c", "d")]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    a: "A is required when b / c / d is missing.",
  });
});

it("isRequiredWithout nested", function () {
  let v = intus.validate(
    {nested: {a: null, b: 2}},
    {"nested.a": [isRequiredWithout("nested.b")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: {a: null, b: null}},
    {"nested.a": [isRequiredWithout("nested.b")]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.a": "Nested.a is required when nested.b is missing.",
  });
});

it("isRequiredWithout nested star", function () {
  let v = intus.validate(
    {nested: [{a: null, b: 2}]},
    {"nested.*.a": [isRequiredWithout("nested.*.b")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: [{a: null, b: null}]},
    {"nested.*.a": [isRequiredWithout("nested.*.b")]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.a": "Nested.0.a is required when nested.0.b is missing.",
  });
});
