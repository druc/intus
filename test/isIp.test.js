import {expect} from "vitest";
import intus from "../index";
import {isIp} from "../rules";

it("validates isIp", function () {
  let invalid = ["aslsdlks"];
  let valid = ["", null, undefined, "127.0.0.1"];

  invalid.forEach(t => {
    let validation = intus.validate({t}, {t: [isIp()]});
    expect(validation.passes()).toBe(false);
    expect(validation.errors()).toMatchObject({
      t: "T must be a valid IP address.",
    });
  });

  valid.forEach(t =>
    expect(intus.validate({t}, {t: [isIp()]}).passes()).toBe(true)
  );
});

it("validates isIp nested", function () {
  expect(
    intus
      .validate({nested: {field: "127.0.0.1"}}, {"nested.field": [isIp()]})
      .passes()
  ).toBe(true);

  let validation = intus.validate(
    {nested: {field: "127.0.0"}},
    {"nested.field": [isIp()]}
  );
  expect(validation.passes()).toBe(false);
  expect(validation.errors()).toMatchObject({
    "nested.field": "Nested.field must be a valid IP address.",
  });
});

it("validates isIp nested star", function () {
  expect(
    intus
      .validate({nested: [{field: "127.0.0.1"}]}, {"nested.*.field": [isIp()]})
      .passes()
  ).toBe(true);

  let validation = intus.validate(
    {nested: [{field: "127.0.0"}]},
    {"nested.*.field": [isIp()]}
  );
  expect(validation.passes()).toBe(false);
  expect(validation.errors()).toMatchObject({
    "nested.0.field": "Nested.0.field must be a valid IP address.",
  });
});
