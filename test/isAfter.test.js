import {expect} from "vitest";
import isAfter from "../rules/isAfter";
import intus from "../index";

it("isAfter", function () {
  let afterDate = new Date(2022, 12, 18);
  let v = intus.validate(
    {date: new Date(2022, 12, 19)},
    {date: [isAfter(afterDate)]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {date: new Date(2022, 12, 18)},
    {date: [isAfter(afterDate)]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    date: `Date must be a date after ${afterDate}.`,
  });
});

it("isAfter passes if value is not a valid date", function () {
  let v = intus.validate(
    {date: "some random value"},
    {date: [isAfter(new Date(2022, 12, 18))]}
  );
  expect(v.passes()).toBe(true);
});

it("isAfter passes if after date is not a valid date", function () {
  let v = intus.validate(
    {date: new Date(2022, 12, 18)},
    {date: [isAfter("random")]}
  );
  expect(v.passes()).toBe(true);
});

it("isAfter works with attributes", function () {
  let v = intus.validate(
    {
      start: new Date(2022, 12, 18),
      end: new Date(2022, 12, 18),
    },
    {start: [isAfter("end")]}
  );
  expect(v.passes()).toBe(false);
});

it("isAfter nested attributes", function () {
  let v = intus.validate(
    {
      nested: {
        start: new Date(2022, 12, 18),
        end: new Date(2022, 12, 18),
      },
    },
    {"nested.start": [isAfter("nested.end")]}
  );

  expect(v.passes()).toBe(false);
});

it("isAfter nested star attributes", function () {
  let v = intus.validate(
    {
      nested: [
        {
          start: new Date(2022, 12, 18),
          end: new Date(2022, 12, 18),
        },
      ],
    },
    {"nested.*.start": [isAfter("nested.*.end")]}
  );

  expect(v.passes()).toBe(false);
});

it("isAfter nested", function () {
  let afterDate = new Date(2022, 12, 18);
  let v = intus.validate(
    {nested: {date: new Date(2022, 12, 19)}},
    {"nested.date": [isAfter(afterDate)]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: {date: new Date(2022, 12, 18)}},
    {"nested.date": [isAfter(afterDate)]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.date": `Nested.date must be a date after ${afterDate}.`,
  });
});

it("isAfter nested star", function () {
  let afterDate = new Date(2022, 12, 18);
  let v = intus.validate(
    {nested: [{date: new Date(2022, 12, 19)}]},
    {"nested.*.date": [isAfter(afterDate)]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: [{date: new Date(2022, 12, 18)}]},
    {"nested.*.date": [isAfter(afterDate)]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.date": `Nested.0.date must be a date after ${afterDate}.`,
  });
});
