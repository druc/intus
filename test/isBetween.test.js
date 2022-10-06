import {expect} from "vitest";
import intus from "../index";
import {isBetween} from "../rules";

it("isBetween", function () {
  let invalid = [16, "16"];
  let valid = [17, 18, "18", 19, "", undefined, null];

  invalid.forEach(t => {
    let validation = intus.validate({t}, {t: [isBetween(17, 20)]});
    expect(validation.passes()).toBe(false);
    expect(validation.errors()).toMatchObject({
      t: "t must be between or equal to 17 and 20.",
    });
  });

  valid.forEach(t =>
    expect(intus.validate({t}, {t: [isBetween(17, 20)]}).passes()).toBe(true)
  );
});

it("isBetween nested", function () {
  let validation = intus.validate(
    {nested: {field: 16}},
    {"nested.field": [isBetween(17, 20)]}
  );
  expect(validation.passes()).toBe(false);
  expect(validation.errors()).toMatchObject({
    "nested.field": "nested.field must be between or equal to 17 and 20.",
  });
});

it("isBetween nested star", function () {
  let validation = intus.validate(
    {nested: [{field: 16}]},
    {"nested.*.field": [isBetween(17, 20)]}
  );
  expect(validation.passes()).toBe(false);
  expect(validation.errors()).toMatchObject({
    "nested.0.field": "nested.0.field must be between or equal to 17 and 20.",
  });
});
