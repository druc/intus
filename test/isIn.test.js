import {expect} from "vitest";
import intus from "../index";
import {isIn} from "../rules";

it("isIn", function () {
  let invalid = [1, "2", "this"];
  let valid = ["", undefined, null, 1, "2", "this"];

  invalid.forEach(t => {
    let v = intus.validate({t}, {t: [isIn("hey", "no", "ok")]});
    expect(v.passes()).toBe(false);
    expect(v.errors()).toMatchObject({t: "t must be one of hey / no / ok."});
  });

  valid.forEach(t =>
    expect(intus.validate({t}, {t: [isIn("1", "2", "this")]}).passes()).toBe(
      true
    )
  );
});

it("isIn nested", function () {
  let v = intus.validate(
    {nested: {field: "this"}},
    {"nested.field": [isIn("this", "and", "that")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: {field: "not"}},
    {"nested.field": [isIn("this", "and", "that")]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.field": "nested.field must be one of this / and / that.",
  });
});

it("isIn nested star", function () {
  let v = intus.validate(
    {nested: [{field: "and"}]},
    {"nested.*.field": [isIn("this", "and", "that")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: [{field: "not"}]},
    {"nested.*.field": [isIn("this", "and", "that")]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.field": "nested.0.field must be one of this / and / that.",
  });
});
