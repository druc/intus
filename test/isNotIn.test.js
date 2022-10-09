import {expect} from "vitest";
import intus from "../index";
import {isNotIn} from "../rules";

it("isNotIn", function () {
  let invalid = [1, "2", "this"];
  let valid = ["", undefined, null, 1, "2", "this"];

  invalid.forEach(t => {
    let v = intus.validate({t}, {t: [isNotIn("1", "2", "this")]});
    expect(v.passes()).toBe(false);
    expect(v.errors()).toMatchObject({t: "T must not be one of 1 / 2 / this."});
  });
  valid.forEach(t =>
    expect(
      intus.validate({t}, {t: [isNotIn("hey", "no", "ok")]}).passes()
    ).toBe(true)
  );
});

it("isNotIn nested", function () {
  let v = intus.validate(
    {nested: {field: "ok"}},
    {"nested.field": [isNotIn("this", "and", "that")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: {field: "this"}},
    {"nested.field": [isNotIn("this", "and", "that")]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.field": "Nested.field must not be one of this / and / that.",
  });
});

it("isNotIn nested star", function () {
  let v = intus.validate(
    {nested: [{field: "ok"}]},
    {"nested.*.field": [isNotIn("this", "and", "that")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: [{field: "this"}]},
    {"nested.*.field": [isNotIn("this", "and", "that")]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.field": "Nested.0.field must not be one of this / and / that.",
  });
});
