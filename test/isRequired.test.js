import intus from "../index";
import {isRequired} from "../rules";
import {makeFile} from "./helpers";

it("validates isRequired", function () {
  let invalid = ["", null, undefined];
  let valid = [
    false,
    true,
    0,
    "1",
    1,
    "Something",
    makeFile("file.txt", "text/plain"),
  ];

  invalid.forEach(t => {
    let validation = intus.validate({t}, {t: [isRequired()]});
    expect(validation.passes()).toBe(false);
    expect(validation.errors()).toMatchObject({t: "t is required."});
  });

  valid.forEach(t =>
    expect(intus.validate({t}, {t: [isRequired()]}).passes()).toBe(true)
  );
});

it("validates isRequired nested", function () {
  expect(
    intus
      .validate({nested: {field: 123}}, {"nested.field": [isRequired()]})
      .passes()
  ).toBe(true);

  let validation = intus.validate({}, {"nested.field": [isRequired()]});
  expect(validation.passes()).toBe(false);
  expect(validation.errors()).toMatchObject({
    "nested.field": "nested.field is required.",
  });
});

it("validates isRequired nested star", function () {
  expect(
    intus
      .validate({nested: [{field: 123}]}, {"nested.*.field": [isRequired()]})
      .passes()
  ).toBe(true);

  let validation = intus.validate(
    {nested: [{}]},
    {"nested.*.field": [isRequired()]}
  );
  expect(validation.passes()).toBe(false);
  expect(validation.errors()).toMatchObject({
    "nested.0.field": "nested.0.field is required.",
  });
});
