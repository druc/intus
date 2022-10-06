import {expect} from "vitest";
import intus from "../index";
import {isBeforeOrEqual} from "../rules";

it("isBeforeOrEqual", function () {
  let dateAfter = new Date(2022, 12, 19);
  let v = intus.validate(
    {date: new Date(2022, 12, 19)},
    {date: [isBeforeOrEqual(dateAfter)]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {date: new Date(2022, 12, 18)},
    {date: [isBeforeOrEqual(dateAfter)]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {date: new Date(2022, 12, 20)},
    {date: [isBeforeOrEqual(dateAfter)]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    date: `date must be a date before or equal to ${dateAfter}.`,
  });
});

it("isBeforeOrEqual passes if value is not a valid date", function () {
  let v = intus.validate(
    {date: "some random value"},
    {date: [isBeforeOrEqual(new Date(2022, 12, 18))]}
  );
  expect(v.passes()).toBe(true);
});

it("isBeforeOrEqual passes if before date is not a valid date", function () {
  let v = intus.validate(
    {date: new Date(2022, 12, 18)},
    {date: [isBeforeOrEqual("random")]}
  );
  expect(v.passes()).toBe(true);
});

it("isBeforeOrEqual attributes", function () {
  let v = intus.validate(
    {
      start: new Date(2022, 12, 20),
      end: new Date(2022, 12, 19),
    },
    {start: [isBeforeOrEqual("end")]}
  );
  expect(v.passes()).toBe(false);
});

it("isBeforeOrEqual nested attributes", function () {
  let v = intus.validate(
    {
      nested: {
        start: new Date(2022, 12, 20),
        end: new Date(2022, 12, 19),
      },
    },
    {"nested.start": [isBeforeOrEqual("nested.end")]}
  );

  expect(v.passes()).toBe(false);
});

it("isBeforeOrEqual nested star attributes", function () {
  let v = intus.validate(
    {
      nested: [
        {
          start: new Date(2022, 12, 20),
          end: new Date(2022, 12, 19),
        },
      ],
    },
    {"nested.*.start": [isBeforeOrEqual("nested.*.end")]}
  );

  expect(v.passes()).toBe(false);
});

it("isBeforeOrEqual nested", function () {
  let dateAfter = new Date(2022, 12, 18);
  let v = intus.validate(
    {nested: {date: new Date(2022, 12, 18)}},
    {"nested.date": [isBeforeOrEqual(dateAfter)]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: {date: new Date(2022, 12, 19)}},
    {"nested.date": [isBeforeOrEqual(dateAfter)]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.date": `nested.date must be a date before or equal to ${dateAfter}.`,
  });
});

it("isBeforeOrEqual nested star", function () {
  let dateAfter = new Date(2022, 12, 19);
  let v = intus.validate(
    {nested: [{date: new Date(2022, 12, 18)}]},
    {"nested.*.date": [isBeforeOrEqual(dateAfter)]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: [{date: new Date(2022, 12, 20)}]},
    {"nested.*.date": [isBeforeOrEqual(dateAfter)]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.date": `nested.0.date must be a date before or equal to ${dateAfter}.`,
  });
});
