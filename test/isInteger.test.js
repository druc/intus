import {expect} from "vitest";
import intus from "../index";
import {isInteger} from "../rules";

it("isInteger", function () {
  let invalid = ["a", 1.5, "1.5"];
  let valid = [1, undefined, null, "", "1"];

  invalid.forEach(t => {
    let v = intus.validate({t}, {t: [isInteger()]});
    expect(v.passes()).toBe(false);
    expect(v.errors()).toMatchObject({t: "t must be an integer."});
  });
  valid.forEach(t =>
    expect(intus.validate({t}, {t: [isInteger()]}).passes()).toBe(true)
  );
});

it("isInteger nested", function () {
  let v = intus.validate({nested: {field: 3}}, {"nested.field": [isInteger()]});
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: {field: "not-int"}},
    {"nested.field": [isInteger()]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.field": "nested.field must be an integer.",
  });
});

it("isInteger nested star", function () {
  let v = intus.validate({nested: {field: 3}}, {"nested.field": [isInteger()]});
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: [{field: "not-int"}]},
    {"nested.*.field": [isInteger()]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.field": "nested.0.field must be an integer.",
  });
});
