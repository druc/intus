import {expect} from "vitest";
import intus from "../index";
import {isGte} from "../rules";

it("isGte", function () {
  let v = intus.validate({a: 2, b: 2}, {a: [isGte("b")]});
  expect(v.passes()).toBe(true);

  v = intus.validate({a: 3, b: 2}, {a: [isGte("b")]});
  expect(v.passes()).toBe(true);

  v = intus.validate({a: null, b: 2}, {a: [isGte("b")]});
  expect(v.passes()).toBe(true);

  v = intus.validate({a: "", b: 2}, {a: [isGte("b")]});
  expect(v.passes()).toBe(true);

  v = intus.validate({a: 3}, {a: [isGte("b")]});
  expect(v.passes()).toBe(true);

  v = intus.validate({a: 3, b: "string"}, {a: [isGte("b")]});
  expect(v.passes()).toBe(false);

  v = intus.validate({a: 1, b: 2}, {a: [isGte("b")]});
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    a: "a must be greater or equal to 2.",
  });
});

it("isGte nested", function () {
  let v = intus.validate(
    {nested: {a: 2, b: 2}},
    {"nested.a": [isGte("nested.b")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate({nested: {a: 1, b: 2}}, {"nested.a": [isGte("nested.b")]});
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.a": "nested.a must be greater or equal to 2.",
  });
});

it("isGte nested star", function () {
  let v = intus.validate(
    {nested: [{a: 2, b: 2}]},
    {"nested.*.a": [isGte("nested.*.b")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: [{a: 1, b: 2}]},
    {"nested.*.a": [isGte("nested.*.b")]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.a": "nested.0.a must be greater or equal to 2.",
  });
});
