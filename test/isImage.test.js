import {expect} from "vitest";
import intus from "../index";
import {isImage} from "../rules";
import {makeFile} from "./helpers";

it("isImage", function () {
  const validFiles = [
    makeFile("file.gif", "image/gif"),
    makeFile("file.jpg", "image/jpeg"),
    makeFile("file.jpeg", "image/jpeg"),
    makeFile("file.svg", "image/svg"),
    makeFile("file.bmp", "image/bmp"),
    makeFile("file.png", "image/png"),
    makeFile("file.png", "image/webp"),
  ];

  validFiles.forEach(file => {
    expect(intus.validate({file: file}, {file: [isImage()]}).passes()).toBe(
      true
    );
  });

  let pdf = makeFile("file.pdf", "application/pdf");

  let v = intus.validate({file: pdf}, {file: [isImage()]});
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    file: "File must be an image.",
  });
});

it("isImage nested", function () {
  let v = intus.validate(
    {nested: {file: makeFile("file.gif", "image/gif")}},
    {"nested.file": [isImage()]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: {file: makeFile("file.pdf", "application/pdf")}},
    {"nested.file": [isImage()]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.file": "Nested.file must be an image.",
  });
});

it("isImage nested star", function () {
  let v = intus.validate(
    {nested: [{file: makeFile("file.gif", "image/gif")}]},
    {"nested.*.file": [isImage()]}
  );
  expect(v.passes()).toBe(true);

  v = intus.validate(
    {nested: [{file: makeFile("file.pdf", "application/pdf")}]},
    {"nested.*.file": [isImage()]}
  );
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "nested.0.file": "Nested.0.file must be an image.",
  });
});
