import {expect} from "vitest";
import intus from "../index";
import {isDate} from "../rules";

it("isDate", function () {
  let invalid = ["1", 1, {}];
  let valid = [
    "",
    undefined,
    null,
    new Date(1995, 12, 17),
    new Date("December 17, 1995 03:24:00"),
  ];

  invalid.forEach(t => {
    let v = intus.validate({t}, {t: [isDate()]});
    expect(v.passes()).toBe(false);
    expect(v.errors()).toMatchObject({t: "t must be a valid date."});
  });

  valid.forEach(t =>
    expect(intus.validate({t}, {t: [isDate()]}).passes()).toBe(true)
  );
});

it("isDate nested", function () {
  let v = intus.validate(
    {nested: {field: new Date()}},
    {"nested.field": [isDate()]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: {field: "not-date"}},
    {"nested.field": [isDate()]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.field": "nested.field must be a valid date.",
  });
});

it("isDate nested star", function () {
  let v = intus.validate(
    {nested: [{field: new Date()}]},
    {"nested.*.field": [isDate()]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: [{field: "not-a-date"}]},
    {"nested.*.field": [isDate()]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.field": "nested.0.field must be a valid date.",
  });
});
