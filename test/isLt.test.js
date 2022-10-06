import {expect} from "vitest";
import intus from "../index";
import {isLt} from "../rules";

it("isLt", function () {
  let v = intus.validate({a: 1, b: 2}, {a: [isLt("b")]});
  expect(v.passes()).toBe(true);

  v = intus.validate({a: null, b: 2}, {a: [isLt("b")]});
  expect(v.passes()).toBe(true);

  v = intus.validate({a: "", b: 2}, {a: [isLt("b")]});
  expect(v.passes()).toBe(true);

  v = intus.validate({a: 3}, {a: [isLt("b")]});
  expect(v.passes()).toBe(true);

  v = intus.validate({a: 3, b: "string"}, {a: [isLt("b")]});
  expect(v.passes()).toBe(false);

  v = intus.validate({a: 2, b: 2}, {a: [isLt("b")]});
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({a: "a must be less than 2."});
});

it("isLt nested", function () {
  let v = intus.validate(
    {nested: {a: 1, b: 2}},
    {"nested.a": [isLt("nested.b")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate({nested: {a: 2, b: 2}}, {"nested.a": [isLt("nested.b")]});
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.a": "nested.a must be less than 2.",
  });
});

it("isLt nested star", function () {
  let v = intus.validate(
    {nested: [{a: 1, b: 2}]},
    {"nested.*.a": [isLt("nested.*.b")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: [{a: 2, b: 2}]},
    {"nested.*.a": [isLt("nested.*.b")]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.a": "nested.0.a must be less than 2.",
  });
});
