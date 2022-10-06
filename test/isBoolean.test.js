import {expect} from "vitest";
import intus from "../index";
import {isBoolean} from "../rules";

it("isBoolean", function () {
  let invalid = ["a", undefined];
  let valid = [true, false, 1, 0];

  invalid.forEach(t => {
    let v = intus.validate({t}, {t: [isBoolean()]});
    expect(v.passes()).toBe(false);
    expect(v.errors()).toMatchObject({t: "t must be a boolean."});
  });
  valid.forEach(t =>
    expect(intus.validate({t}, {t: [isBoolean()]}).passes()).toBe(true)
  );
});

it("isBoolean nested", function () {
  let v = intus.validate(
    {nested: {field: true}},
    {"nested.field": [isBoolean()]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: {field: "something"}},
    {"nested.field": [isBoolean()]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.field": "nested.field must be a boolean.",
  });
});

it("isBoolean nested star", function () {
  let v = intus.validate(
    {nested: [{field: true}]},
    {"nested.*.field": [isBoolean()]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: [{field: "something"}]},
    {"nested.*.field": [isBoolean()]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.field": "nested.0.field must be a boolean.",
  });
});
