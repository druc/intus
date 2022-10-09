import {expect} from "vitest";
import intus from "../index";
import {isSame} from "../rules";

it("should validate isSame", function () {
  let v = intus.validate({a: "2", b: 2}, {a: [isSame("b")]});
  expect(v.passes()).toBe(true);

  v = intus.validate({a: null, b: null}, {a: [isSame("b")]});
  expect(v.passes()).toBe(true);

  v = intus.validate({a: 1, b: 2}, {a: [isSame("b")]});
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({a: "A must be the same as b."});

  v = intus.validate({a: null, b: 2}, {a: [isSame("b")]});
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    a: "A must be the same as b.",
  });
});

it("should validate isSame nested", function () {
  let v = intus.validate(
    {nested: {a: 2, b: 2}},
    {"nested.a": [isSame("nested.b")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: {a: 2, b: 3}},
    {"nested.a": [isSame("nested.b")]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.a": "Nested.a must be the same as nested.b.",
  });
});

it("should validate isSame nested star", function () {
  let v = intus.validate(
    {nested: [{a: 2, b: 2}]},
    {"nested.*.a": [isSame("nested.*.b")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: [{a: 2, b: 3}]},
    {"nested.*.a": [isSame("nested.*.b")]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.a": "Nested.0.a must be the same as nested.0.b.",
  });
});
