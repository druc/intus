import {expect} from "vitest";
import intus from "../index";
import isAfterOrEqual from "../rules/isAfterOrEqual";
import isAfter from "../rules/isAfter";

it("isAfterOrEqual", function () {
  let dateAfter = new Date(2022, 12, 18);
  let v = intus.validate(
    {date: new Date(2022, 12, 19)},
    {date: [isAfterOrEqual(dateAfter)]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {date: new Date(2022, 12, 18)},
    {date: [isAfterOrEqual(dateAfter)]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {date: new Date(2022, 12, 17)},
    {date: [isAfterOrEqual(dateAfter)]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    date: `date must be a date after or equal to ${dateAfter}.`,
  });
});

it("isAfterOrEqual passes if value is not a valid date", function () {
  let v = intus.validate(
    {date: "some random value"},
    {date: [isAfterOrEqual(new Date(2022, 12, 18))]}
  );
  expect(v.passes()).toBe(true);
});

it("isAfterOrEqual passes if after date is not a valid date", function () {
  let v = intus.validate(
    {date: new Date(2022, 12, 18)},
    {date: [isAfterOrEqual("random")]}
  );
  expect(v.passes()).toBe(true);
});

it("isAfterOrEqual attributes", function () {
  let v = intus.validate(
    {
      start: new Date(2022, 12, 18),
      end: new Date(2022, 12, 19),
    },
    {start: [isAfterOrEqual("end")]}
  );
  expect(v.passes()).toBe(false);
});

it("isAfterOrEqual nested attributes", function () {
  let v = intus.validate(
    {
      nested: {
        start: new Date(2022, 12, 18),
        end: new Date(2022, 12, 19),
      },
    },
    {"nested.start": [isAfterOrEqual("nested.end")]}
  );

  expect(v.passes()).toBe(false);
});

it("isAfterOrEqual nested star attributes", function () {
  let v = intus.validate(
    {
      nested: [
        {
          start: new Date(2022, 12, 18),
          end: new Date(2022, 12, 19),
        },
      ],
    },
    {"nested.*.start": [isAfter("nested.*.end")]}
  );

  expect(v.passes()).toBe(false);
});

it("isAfterOrEqual nested", function () {
  let dateAfter = new Date(2022, 12, 18);
  let v = intus.validate(
    {nested: {date: new Date(2022, 12, 18)}},
    {"nested.date": [isAfterOrEqual(dateAfter)]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: {date: new Date(2022, 12, 17)}},
    {"nested.date": [isAfterOrEqual(dateAfter)]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.date": `nested.date must be a date after or equal to ${dateAfter}.`,
  });
});

it("isAfterOrEqual nested star", function () {
  let dateAfter = new Date(2022, 12, 18);
  let v = intus.validate(
    {nested: [{date: new Date(2022, 12, 18)}]},
    {"nested.*.date": [isAfterOrEqual(dateAfter)]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: [{date: new Date(2022, 12, 17)}]},
    {"nested.*.date": [isAfterOrEqual(dateAfter)]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.date": `nested.0.date must be a date after or equal to ${dateAfter}.`,
  });
});
