import {expect} from "vitest";
import intus from "../index";
import {isGt} from "../rules";

it("isGt", function () {
  let v = intus.validate({a: 3, b: 2}, {a: [isGt("b")]});
  expect(v.passes()).toBe(true);

  v = intus.validate({a: null, b: 2}, {a: [isGt("b")]});
  expect(v.passes()).toBe(true);

  v = intus.validate({a: "", b: 2}, {a: [isGt("b")]});
  expect(v.passes()).toBe(true);

  v = intus.validate({a: 3}, {a: [isGt("b")]});
  expect(v.passes()).toBe(true);

  v = intus.validate({a: 3, b: "string"}, {a: [isGt("b")]});
  expect(v.passes()).toBe(false);

  v = intus.validate({a: 1, b: 2}, {a: [isGt("b")]});
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({a: "A must be greater than 2."});
});

it("isGt nested", function () {
  let v = intus.validate(
    {nested: {a: 3, b: 2}},
    {"nested.a": [isGt("nested.b")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate({nested: {a: 1, b: 2}}, {"nested.a": [isGt("nested.b")]});
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.a": "Nested.a must be greater than 2.",
  });
});

it("isGt nested star", function () {
  let v = intus.validate(
    {nested: [{a: 3, b: 2}]},
    {"nested.*.a": [isGt("nested.*.b")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: [{a: 1, b: 2}]},
    {"nested.*.a": [isGt("nested.*.b")]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.a": "Nested.0.a must be greater than 2.",
  });
});
