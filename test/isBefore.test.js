import {expect} from "vitest";
import intus from "../index";
import isBefore from "../rules/isBefore";

it("isBefore", function () {
  let beforeDate = new Date(2022, 12, 18);
  let v = intus.validate(
    {date: new Date(2021, 12, 18)},
    {date: [isBefore(beforeDate)]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {date: new Date(2022, 12, 19)},
    {date: [isBefore(beforeDate)]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    date: `Date must be a date before ${beforeDate}.`,
  });
});

it("isBefore passes if value is not a valid date", function () {
  let v = intus.validate(
    {date: "some random value"},
    {date: [isBefore(new Date(2022, 12, 18))]}
  );
  expect(v.passes()).toBe(true);
});

it("isBefore passes if before date is not a valid date", function () {
  let v = intus.validate(
    {date: new Date(2022, 12, 18)},
    {date: [isBefore("random")]}
  );
  expect(v.passes()).toBe(true);
});

it("isBefore nested", function () {
  let beforeDate = new Date(2022, 12, 22);
  let v = intus.validate(
    {nested: {date: new Date(2022, 12, 19)}},
    {"nested.date": [isBefore(beforeDate)]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: {date: new Date(2022, 12, 23)}},
    {"nested.date": [isBefore(beforeDate)]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.date": `Nested.date must be a date before ${beforeDate}.`,
  });
});

it("isBefore nested star", function () {
  let beforeDate = new Date(2022, 12, 22);
  let v = intus.validate(
    {nested: [{date: new Date(2022, 12, 19)}]},
    {"nested.*.date": [isBefore(beforeDate)]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: [{date: new Date(2022, 12, 23)}]},
    {"nested.*.date": [isBefore(beforeDate)]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.date": `Nested.0.date must be a date before ${beforeDate}.`,
  });
});

it("isBefore attributes", function () {
  let beforeDate = new Date(2022, 12, 18);
  let v = intus.validate(
    {
      start: new Date(2022, 12, 17),
      end: beforeDate,
    },
    {start: [isBefore("end")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {
      start: new Date(2022, 12, 23),
      end: beforeDate,
    },
    {start: [isBefore("end")]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    start: `Start must be a date before ${beforeDate}.`,
  });
});

it("isBefore nested attributes", function () {
  let beforeDate = new Date(2022, 12, 18);
  let v = intus.validate(
    {
      nested: {
        start: new Date(2022, 12, 17),
        end: beforeDate,
      },
    },
    {"nested.start": [isBefore("nested.end")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {
      nested: {
        start: new Date(2022, 12, 23),
        end: beforeDate,
      },
    },
    {"nested.start": [isBefore("nested.end")]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.start": `Nested.start must be a date before ${beforeDate}.`,
  });
});

it("isBefore nested star attributes", function () {
  let beforeDate = new Date(2022, 12, 18);
  let v = intus.validate(
    {
      nested: [
        {
          start: new Date(2022, 12, 17),
          end: beforeDate,
        },
      ],
    },
    {"nested.*.start": [isBefore("nested.*.end")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {
      nested: [
        {
          start: new Date(2022, 12, 23),
          end: beforeDate,
        },
      ],
    },
    {"nested.*.start": [isBefore("nested.*.end")]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.start": `Nested.0.start must be a date before ${beforeDate}.`,
  });
});
