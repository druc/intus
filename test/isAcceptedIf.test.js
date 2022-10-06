import {expect} from "vitest";
import {isAcceptedIf} from "../rules";
import intus from "../index";

it("isAcceptedIf", function () {
  let v = intus.validate(
    {terms: "on", age: 12},
    {terms: [isAcceptedIf("age", 12)]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate({age: 12}, {terms: [isAcceptedIf("age", 12)]});
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    terms: "terms must be accepted if age is 12.",
  });
});

it("isAcceptedIf nested", function () {
  let v = intus.validate(
    {nested: {field: "on", age: 12}},
    {"nested.field": [isAcceptedIf("nested.age", 12)]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: {field: "off"}},
    {"nested.field": [isAcceptedIf("nested.age", 12)]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: {age: 12}},
    {"nested.field": [isAcceptedIf("nested.age", 12)]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.field": "nested.field must be accepted if nested.age is 12.",
  });
});

it("isAcceptedIf nested star", function () {
  let v = intus.validate(
    {nested: [{field: "on", age: 12}]},
    {"nested.*.field": [isAcceptedIf("nested.*.age", 12)]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: [{field: "off"}]},
    {"nested.*.field": [isAcceptedIf("nested.*.age", 12)]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: [{age: 12}]},
    {"nested.*.field": [isAcceptedIf("nested.*.age", 12)]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.field": "nested.0.field must be accepted if nested.0.age is 12.",
  });
});
