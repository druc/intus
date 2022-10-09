import {expect} from "vitest";
import intus from "../index";
import {isRequiredIfAccepted} from "../rules";

it("isRequiredIfAccepted", function () {
  let v = intus.validate(
    {name: "Constantin", terms: true},
    {name: [isRequiredIfAccepted("terms")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate({terms: "on"}, {name: [isRequiredIfAccepted("terms")]});
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    name: "Name is required if terms is accepted.",
  });
});

it("isRequiredIfAccepted nested", function () {
  let v = intus.validate(
    {terms: true, nested: {field: 123}},
    {"nested.field": [isRequiredIfAccepted("terms")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {terms: true, nested: {}},
    {"nested.field": [isRequiredIfAccepted("terms")]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.field": "Nested.field is required if terms is accepted.",
  });
});

it("isRequiredIfAccepted nested star", function () {
  let v = intus.validate(
    {terms: true, nested: [{field: 123}]},
    {"nested.*.field": [isRequiredIfAccepted("terms")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {sub: {terms: true}, nested: [{}]},
    {"nested.*.field": [isRequiredIfAccepted("sub.terms")]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.field": "Nested.0.field is required if sub.terms is accepted.",
  });
});

it("isRequiredIfAccepted nested overwrite attribute translation", function () {
  let v = intus.validate(
    {sub: {terms: true}, nested: [{}]},
    {"nested.*.field": [isRequiredIfAccepted("sub.terms")]},
    {"nested.*.field": "something", "sub.terms": "abc"}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.field": "Something is required if abc is accepted.",
  });
});
