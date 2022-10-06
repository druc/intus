import {expect} from "vitest";
import intus from "../index";
import {isRequiredWith} from "../rules";

it("isRequiredWith", function () {
  let v = intus.validate({a: 1, b: 2}, {a: [isRequiredWith("b")]});
  expect(v.passes()).toBe(true);

  v = intus.validate({a: null, b: null}, {a: [isRequiredWith("b")]});
  expect(v.passes()).toBe(true);

  v = intus.validate({a: null, b: 2}, {a: [isRequiredWith("b")]});
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({a: "a is required when b is present."});
});

it("isRequiredWith many", function () {
  let v = intus.validate(
    {a: null, e: 2},
    {a: [isRequiredWith("b", "c", "d", "e")]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    a: "a is required when b / c / d / e is present.",
  });
});

it("isRequiredWith nested", function () {
  let v = intus.validate(
    {a: {b: null}, c: {d: 2}},
    {"a.b": [isRequiredWith("c.d")]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "a.b": "a.b is required when c.d is present.",
  });
});

it("isRequiredWith nested star", function () {
  let v = intus.validate(
    {nested: [{a: {b: null}, c: {d: 2}}]},
    {"nested.*.a.b": [isRequiredWith("nested.*.c.d")]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.a.b": "nested.0.a.b is required when nested.0.c.d is present.",
  });
});
