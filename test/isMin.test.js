import {expect} from "vitest";
import intus from "../index";
import {isMin} from "../rules";
import {makeFile} from "./helpers";

it("isMin", function () {
  let invalid = [17];
  let valid = [18, 19, "", undefined, null];

  invalid.forEach(t => {
    let validation = intus.validate({t}, {t: [isMin(18)]});
    expect(validation.passes()).toBe(false);
    expect(validation.errors()).toMatchObject({t: "T must be at least 18."});
  });
  valid.forEach(t =>
    expect(intus.validate({t}, {t: [isMin(18)]}).passes()).toBe(true)
  );
});

it("isMin takes length into account when value is a string", function () {
  let v = intus.validate({name: "abc"}, {name: [isMin(3)]});
  expect(v.passes()).toBe(true);

  v = intus.validate({name: "ab"}, {name: [isMin(3)]});
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    name: "Name must be at least 3 characters long.",
  });
});

it("isMin takes length into account when value is an array", function () {
  let v = intus.validate({items: [1, 2, 3]}, {items: [isMin(3)]});
  expect(v.passes()).toBe(true);

  v = intus.validate({items: [1, 2]}, {items: [isMin(3)]});
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    items: "Items must have at least 3 items.",
  });
});

it("isMin takes size into account when value is a file", function () {
  let v = intus.validate(
    {file: makeFile("file.txt", "text/plain", 10)},
    {file: [isMin(3)]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {file: makeFile("file.txt", "text/plain", 1)},
    {file: [isMin(2)]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    file: "File must be at least 2MB.",
  });
});

it("isMin nested", function () {
  expect(
    intus
      .validate({nested: {field: 17}}, {"nested.field": [isMin(17)]})
      .passes()
  ).toBe(true);

  let validation = intus.validate(
    {nested: {field: 17}},
    {"nested.field": [isMin(18)]}
  );
  expect(validation.passes()).toBe(false);
  expect(validation.errors()).toMatchObject({
    "nested.field": "Nested.field must be at least 18.",
  });
});

it("isMin nested star", function () {
  let validation = intus.validate(
    {nested: [{field: 17}]},
    {"nested.*.field": [isMin(18)]}
  );
  expect(validation.passes()).toBe(false);
  expect(validation.errors()).toMatchObject({
    "nested.0.field": "Nested.0.field must be at least 18.",
  });
});

it("isMin message based on type", function () {
  let v = intus.validate(
    {
      nested: [
        {field: 9},
        {field: "abc"},
        {field: makeFile("a.jpg", "image/jpg", 1)},
        {field: [1, 2, 3]},
      ],
    },
    {"nested.*.field": [isMin(10)]}
  );
  expect(v.passes()).toBe(false);

  expect(v.errors()).toMatchObject({
    "nested.0.field": "Nested.0.field must be at least 10.",
    "nested.1.field": "Nested.1.field must be at least 10 characters long.",
    "nested.2.field": "Nested.2.field must be at least 10MB.",
    "nested.3.field": "Nested.3.field must have at least 10 items.",
  });
});
