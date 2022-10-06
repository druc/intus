import {expect} from "vitest";
import intus from "../index";
import {isExtension} from "../rules";
import {makeFile} from "./helpers";

it("isExtension", function () {
  let file = makeFile("file.txt", "text/plain");

  expect(intus.validate({file}, {file: [isExtension("txt")]}).passes()).toBe(
    true
  );

  let validation = intus.validate({file}, {file: [isExtension("pdf", "jpg")]});
  expect(validation.passes()).toBe(false);
  expect(validation.errors()).toMatchObject({
    file: "file must be a file of type pdf / jpg.",
  });
});

it("isExtension nested", function () {
  let file = makeFile("file.txt", "text/plain");

  expect(
    intus
      .validate({nested: {file}}, {"nested.file": [isExtension("txt")]})
      .passes()
  ).toBe(true);

  let validation = intus.validate(
    {nested: {file}},
    {"nested.file": [isExtension("pdf", "jpg")]}
  );
  expect(validation.passes()).toBe(false);
  expect(validation.errors()).toMatchObject({
    "nested.file": "nested.file must be a file of type pdf / jpg.",
  });
});

it("isExtension nested star", function () {
  let file = makeFile("file.txt", "text/plain");

  expect(
    intus
      .validate({nested: [{file}]}, {"nested.*.file": [isExtension("txt")]})
      .passes()
  ).toBe(true);

  let validation = intus.validate(
    {nested: [{file}]},
    {"nested.*.file": [isExtension("pdf", "jpg")]}
  );
  expect(validation.passes()).toBe(false);
  expect(validation.errors()).toMatchObject({
    "nested.0.file": "nested.0.file must be a file of type pdf / jpg.",
  });
});
