import {expect} from "vitest";
import intus from "../index";
import {isEmail} from "../rules";

it("isEmail", function () {
  let invalid = [
    "😃@i.com",
    "john@example.com ",
    "john@example.com extra",
    "45454.com",
    "sdfsf@",
  ];
  let valid = [
    undefined,
    null,
    "",
    "john@example.com",
    "m@i.com",
    "m@i.de",
    "m@i.co.uk",
  ];

  invalid.forEach(t => {
    let v = intus.validate({t}, {t: [isEmail()]});
    expect(v.passes()).toBe(false);
    expect(v.errors()).toMatchObject({t: "T must be a valid email."});
  });
  valid.forEach(t =>
    expect(intus.validate({t}, {t: [isEmail()]}).passes()).toBe(true)
  );
});

it("isEmail nested", function () {
  let v = intus.validate(
    {nested: {field: "druc@gmail.com"}},
    {"nested.field": [isEmail()]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: {field: "something"}},
    {"nested.field": [isEmail()]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.field": "Nested.field must be a valid email.",
  });
});

it("isEmail nested star", function () {
  let v = intus.validate(
    {nested: [{field: "druc@gmail.com"}]},
    {"nested.*.field": [isEmail()]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: [{field: "something"}]},
    {"nested.*.field": [isEmail()]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.field": "Nested.0.field must be a valid email.",
  });
});
