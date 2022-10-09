import {expect} from "vitest";
import intus from "../index";
import {isMime} from "../rules";
import {makeFile} from "./helpers";

it("isMime", function () {
  let file = makeFile("file.txt", "text/plain");

  let v = intus.validate({file}, {file: [isMime("text/*")]});
  expect(v.passes()).toBe(true);

  v = intus.validate({file}, {file: [isMime("text/plain")]});
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {file},
    {file: [isMime("application/pdf", "application/json")]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    file: "File must be a file of type application/pdf / application/json.",
  });
});

it("isMime nested", function () {
  let file = makeFile("file.txt", "text/plain");

  let v = intus.validate(
    {nested: {file}},
    {"nested.file": [isMime("text/plain")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate({nested: {file}}, {"nested.file": [isMime("image/jpeg")]});
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.file": "Nested.file must be a file of type image/jpeg.",
  });
});

it("isMime nested star", function () {
  let file = makeFile("file.txt", "text/plain");

  let v = intus.validate(
    {nested: [{file}]},
    {"nested.*.file": [isMime("text/plain")]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: [{file}]},
    {"nested.*.file": [isMime("image/jpeg")]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.file": "Nested.0.file must be a file of type image/jpeg.",
  });
});
