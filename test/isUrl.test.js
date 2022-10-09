import {expect} from "vitest";
import intus from "../index";
import {isUrl} from "../rules";

it("isUrl", function () {
  let invalid = [123, "http:", "ww.x"];
  let valid = [
    undefined,
    null,
    "",
    "https://tallpad.com",
    "https://cdruc.com/",
    "cdruc.com",
  ];

  invalid.forEach(t => {
    let v = intus.validate({t}, {t: [isUrl()]});
    expect(v.passes()).toBe(false);
    expect(v.errors()).toMatchObject({t: "T must be a valid URL."});
  });
  valid.forEach(t =>
    expect(intus.validate({t}, {t: [isUrl()]}).passes()).toBe(true)
  );
});

it("isUrl nested", function () {
  let v = intus.validate(
    {nested: {field: "http://tallpad.com"}},
    {"nested.field": [isUrl()]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate({nested: {field: "not-url"}}, {"nested.field": [isUrl()]});
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.field": "Nested.field must be a valid URL.",
  });
});

it("isUrl nested star", function () {
  let v = intus.validate(
    {nested: [{field: "http://tallpad.com"}]},
    {"nested.*.field": [isUrl()]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: [{field: "not-url"}]},
    {"nested.*.field": [isUrl()]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.field": "Nested.0.field must be a valid URL.",
  });
});
