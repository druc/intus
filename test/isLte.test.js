import {expect} from "vitest";
import intus from "../index";
import {isLte} from "../rules";

it("isLte", function () {
  let v = intus.validate({a: 2, b: 2}, {a: [isLte("b")]});
  expect(v.passes()).toBe(true);

  v = intus.validate({a: 1, b: 2}, {a: [isLte("b")]});
  expect(v.passes()).toBe(true);

  v = intus.validate({a: null, b: 2}, {a: [isLte("b")]});
  expect(v.passes()).toBe(true);

  v = intus.validate({a: "", b: 2}, {a: [isLte("b")]});
  expect(v.passes()).toBe(true);

  v = intus.validate({a: 3}, {a: [isLte("b")]});
  expect(v.passes()).toBe(true);

  v = intus.validate({a: 3, b: "string"}, {a: [isLte("b")]});
  expect(v.passes()).toBe(false);

  v = intus.validate({a: 3, b: 2}, {a: [isLte("b")]});
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    a: "A must be less or equal to 2.",
  });
});

it("isLte nested", function () {
  let v = intus.validate(
    {nested: {a: 2, b: 2}},
    {"nested.a": [isLte("nested.b")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate({nested: {a: 3, b: 2}}, {"nested.a": [isLte("nested.b")]});
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.a": "Nested.a must be less or equal to 2.",
  });
});

it("isLte nested star", function () {
  let v = intus.validate(
    {nested: [{a: 2, b: 2}]},
    {"nested.*.a": [isLte("nested.*.b")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: [{a: 3, b: 2}]},
    {"nested.*.a": [isLte("nested.*.b")]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.a": "Nested.0.a must be less or equal to 2.",
  });
});
