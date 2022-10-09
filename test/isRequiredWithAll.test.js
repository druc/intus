import {expect} from "vitest";
import intus from "../index";
import {isRequiredWithAll} from "../rules";

it("isRequiredWithAll", function () {
  let v = intus.validate(
    {a: 1, b: 2, c: 2},
    {a: [isRequiredWithAll("b", "c")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {a: null, b: null, c: null},
    {a: [isRequiredWithAll("b", "c")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {a: null, b: 2, c: null},
    {a: [isRequiredWithAll("b", "c")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate({a: null, b: 2, c: 2}, {a: [isRequiredWithAll("b", "c")]});
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    a: "A is required when b / c are present.",
  });
});

it("isRequiredWithAll nested", function () {
  let v = intus.validate(
    {nested: {a: 1, b: 2, c: 2}},
    {"nested.a": [isRequiredWithAll("nested.b", "nested.c")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: {a: null, b: 2, c: 2}},
    {"nested.a": [isRequiredWithAll("nested.b", "nested.c")]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.a": "Nested.a is required when nested.b / nested.c are present.",
  });
});

it("isRequiredWithAll nested star", function () {
  let v = intus.validate(
    {
      nested: [
        {
          a: 1,
          b: 2,
          c: 2,
        },
      ],
    },
    {"nested.*.a": [isRequiredWithAll("nested.*.b", "nested.*.c")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {
      nested: [
        {
          a: null,
          b: 2,
          c: 2,
        },
      ],
    },
    {"nested.*.a": [isRequiredWithAll("nested.*.b", "nested.*.c")]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.a":
      "Nested.0.a is required when nested.0.b / nested.0.c are present.",
  });
});
