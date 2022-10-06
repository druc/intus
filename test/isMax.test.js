import {expect} from "vitest";
import intus from "../index";
import {isMax} from "../rules";
import {makeFile} from "./helpers";

it("isMax", function () {
  let invalid = [100];
  let valid = [98, 99, "", undefined, null];

  invalid.forEach(t => {
    let validation = intus.validate({t}, {t: [isMax(99)]});
    expect(validation.passes()).toBe(false);
    expect(validation.errors()).toMatchObject({t: "t must be at most 99."});
  });

  valid.forEach(t =>
    expect(intus.validate({t}, {t: [isMax(99)]}).passes()).toBe(true)
  );
});

it("isMax takes length into account when value is a string", function () {
  let v = intus.validate({name: "abc"}, {name: [isMax(3)]});
  expect(v.passes()).toBe(true);

  v = intus.validate({name: "abcd"}, {name: [isMax(3)]});
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    name: "name must be at most 3 characters long.",
  });
});

it("isMax takes length into account when value is an array", function () {
  let v = intus.validate({items: [1, 2, 3]}, {items: [isMax(3)]});
  expect(v.passes()).toBe(true);

  v = intus.validate({items: [1, 2, 3, 4]}, {items: [isMax(3)]});
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    items: "items must have at most 3 items.",
  });
});

it("isMax takes size into account when value is a file", function () {
  let v = intus.validate(
    {file: makeFile("file.txt", "text/plain", 1)},
    {file: [isMax(1024)]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {file: makeFile("file.txt", "text/plain", 2)},
    {file: [isMax(1)]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    file: "file must be at most 1MB.",
  });
});

it("isMax nested", function () {
  let validation = intus.validate(
    {nested: {field: 100}},
    {"nested.field": [isMax(99)]}
  );
  expect(validation.passes()).toBe(false);
  expect(validation.errors()).toMatchObject({
    "nested.field": "nested.field must be at most 99.",
  });
});

it("isMax nested star", function () {
  let v = intus.validate(
    {nested: [{field: 100}]},
    {"nested.*.field": [isMax(99)]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.field": "nested.0.field must be at most 99.",
  });
});

it("isMax message based on type", function () {
  let v = intus.validate(
    {
      nested: [
        {field: 100},
        {field: "abc"},
        {field: makeFile("a.jpg", "image/jpg", 2)},
        {field: [1, 2, 3]},
      ],
    },
    {"nested.*.field": [isMax(1)]}
  );
  expect(v.passes()).toBe(false);

  expect(v.errors()).toMatchObject({
    "nested.0.field": "nested.0.field must be at most 1.",
    "nested.1.field": "nested.1.field must be at most 1 characters long.",
    "nested.2.field": "nested.2.field must be at most 1MB.",
    "nested.3.field": "nested.3.field must have at most 1 items.",
  });
});
