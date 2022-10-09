import {expect} from "vitest";
import intus from "../index";
import {isRequiredWithoutAll} from "../rules";

it("isRequiredWithoutAll", function () {
  let v = intus.validate({a: 1, b: 2}, {a: [isRequiredWithoutAll("b")]});
  expect(v.passes()).toBe(true);

  v = intus.validate({a: null, b: 2}, {a: [isRequiredWithoutAll("b")]});
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {a: null, b: 2},
    {a: [isRequiredWithoutAll("b", "c", "d", "e")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate({a: null}, {a: [isRequiredWithoutAll("b", "c", "d")]});
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    a: "A is required when b / c / d are missing.",
  });
});

it("isRequiredWithoutAll nested", function () {
  let v = intus.validate(
    {nested: {a: 1, b: 2}},
    {"nested.a": [isRequiredWithoutAll("nested.b")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: {a: null}},
    {"nested.a": [isRequiredWithoutAll("nested.b")]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.a": "Nested.a is required when nested.b are missing.",
  });
});

it("isRequiredWithoutAll nested star", function () {
  let v = intus.validate(
    {nested: [{a: 1, b: 2}]},
    {"nested.*.a": [isRequiredWithoutAll("nested.*.b")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: [{a: null}]},
    {"nested.*.a": [isRequiredWithoutAll("nested.*.b")]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.a": "Nested.0.a is required when nested.0.b are missing.",
  });
});
