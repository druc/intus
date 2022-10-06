import {expect} from "vitest";
import {isAccepted} from "../rules";
import intus from "../index";

it("isAccepted", function () {
  let invalid = [undefined, "", "z", false];
  let valid = [1, "yes", "on", true];

  invalid.forEach(t => {
    let v = intus.validate({t}, {t: [isAccepted()]});
    expect(v.passes()).toBe(false);
  });
  valid.forEach(t =>
    expect(intus.validate({t}, {t: [isAccepted()]}).passes()).toBe(true)
  );
});

it("isAccepted nested", function () {
  let v = intus.validate(
    {nested: {field: "on"}},
    {"nested.field": [isAccepted()]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: {field: "not-accepted"}},
    {"nested.field": [isAccepted()]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.field": "nested.field must be accepted.",
  });
});

it("isAccepted nested star", function () {
  let v = intus.validate(
    {nested: [{field: "on"}]},
    {"nested.*.field": [isAccepted()]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: [{field: "not-accepted"}]},
    {"nested.*.field": [isAccepted()]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.field": "nested.0.field must be accepted.",
  });
});
