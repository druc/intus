import {expect} from "vitest";
import intus from "../index";
import {isDistinct} from "../rules";

it("isDistinct", function () {
  let v = intus.validate({users: [1, "1"]}, {"users.*": [isDistinct()]});
  expect(v.passes()).toBe(false);
  expect(v.errors()).toMatchObject({
    "users.0": "users.0 must be distinct.",
    "users.1": "users.1 must be distinct.",
  });
});

it("isDistinct strict", function () {
  let v = intus.validate(
    {users: [1, "1"]},
    {"users.*": [isDistinct("strict")]}
  );
  expect(v.passes()).toBe(true);
});

it("isDistinct ignoreCase", function () {
  let v = intus.validate(
    {users: ["a", "A"]},
    {"users.*": [isDistinct("ignoreCase")]}
  );
  expect(v.passes()).toBe(false);

  v = intus.validate({users: ["a", "A"]}, {"users.*": [isDistinct()]});
  expect(v.passes()).toBe(true);
});
