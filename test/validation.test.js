import {describe} from "vitest";
import {
  isDate,
  isEmail,
  isImage,
  isIn,
  isMax,
  isMin,
  isRequired,
  isRequiredIf,
  isRequiredWithout,
} from "../rules";
import intus from "../index";
import Intus from "../lib/intus";
import {makeFile} from "./helpers";

describe("validation", () => {
  it("XXX should glass", function () {
    let v = intus.validate(
      {
        name: "cdruc",
        frame: makeFile("plm.jpeg", "image/jpeg"),
        photos: [makeFile("plm.jpeg", "image/jpeg")],
      },
      {
        name: [isRequired(), isMin(5)],
        frame: [isImage()],
        "photos.*": [isImage()],
      }
    );
    expect(v.passes()).toBe(true);
  });
  it("XXX should order request", function () {
    let v = intus.validate(
      {
        billing_address_same_as_delivery: "on",
        delivery_address: {
          street: "ss",
          country_code: "DS",
          postal_code: "dsq",
          house_number: "11",
          city: "ddd",
        },
        billing_address: {
          street: "",
          country_code: "",
          postal_code: "",
          house_number: "",
          city: "",
        },
        payment_method: "stripe",
        date_of_birth: new Date(),
      },
      {
        delivery_address: [isRequired()],
        "delivery_address.street": [isRequired()],
        "delivery_address.country_code": [isRequired(), isMax(2)],
        "delivery_address.postal_code": [isRequired(), isMax(12)],
        "delivery_address.house_number": [isRequired()],
        "delivery_address.city": [isRequired()],
        billing_address: [
          isRequiredWithout("billing_address_same_as_delivery"),
        ],
        "billing_address.street": [
          isRequiredWithout("billing_address_same_as_delivery"),
        ],
        "billing_address.country_code": [
          isRequiredWithout("billing_address_same_as_delivery"),
          isMax(2),
        ],
        "billing_address.postal_code": [
          isRequiredWithout("billing_address_same_as_delivery"),
          isMax(12),
        ],
        "billing_address.house_number": [
          isRequiredWithout("billing_address_same_as_delivery"),
        ],
        "billing_address.city": [
          isRequiredWithout("billing_address_same_as_delivery"),
        ],
        payment_method: [isRequired(), isIn("paypal", "stripe")],
        date_of_birth: [isRequiredIf("payment_method", "stripe"), isDate()],
      }
    );

    expect(v.passes()).toBe(true);
  });

  it("XXX should user request", function () {
    let v = intus.validate(
      {
        first_name: "",
        last_name: Array.from({length: 257}).join("."),
        email: "not-mail",
        phone: "0749878321",
      },
      {
        first_name: [isRequired(), isMax(255)],
        last_name: [isRequired(), isMax(255)],
        email: [isRequired(), isEmail(), isMax(255)],
      }
    );

    expect(v.passes()).toBe(false);
  });

  it("should convert snake_case attributes to words when getting erros", function () {
    let v = intus.validate(
      {
        first_name: "",
      },
      {
        first_name: [isRequired()],
      }
    );

    expect(v.passes()).toBe(false);
    expect(v.errors()).toMatchObject({
      first_name: "First name is required.",
    });
  });

  it("nested error messages are overwritten", function () {
    let validation = intus.validate(
      {
        users: [{name: "", posts: [{title: ""}]}],
      },
      {
        "users.*.name": [isRequired()],
        "users.*.posts.*.title": [isRequired()],
      },
      {
        "users.*.name": "user name",
        "users.*.posts.*.title.isRequired": "post title is required",
      }
    );

    expect(validation.passes()).toBe(false);
    expect(validation.errors()).toMatchObject({
      "users.0.name": "User name is required.",
      "users.0.posts.0.title": "Post title is required",
    });
  });

  it("scares me to test this", function () {
    let validation = intus.validate(
      {
        users: [
          {
            name: "Constantin",
            posts: [{title: "Too short", ps: [{words: 3}]}],
          },
        ],
      },
      {
        "users.*.name": [isRequired()],
        "users.*.posts.*.title": [isMin(20)],
      },
      {}
    );

    expect(validation.errors()).toMatchObject({
      "users.0.posts.0.title":
        "Users.0.posts.0.title must be at least 20 characters long.",
    });
  });

  it("nested object error messages are overwritten ", function () {
    let validation = intus.validate(
      {
        users: [{name: "Constantin", posts: [{title: ""}]}],
      },
      {
        "users.*.name": [isRequired()],
        "users.*.posts.*.title": [isRequired()],
      },
      {
        "users.*.name.isRequired": "User name is required",
        "users.*.posts.*.title": {
          isRequired: "Post title is required",
        },
      }
    );

    expect(validation.passes()).toBe(false);
    expect(validation.errors()).toMatchObject({
      "users.0.posts.0.title": "Post title is required",
    });
  });

  it("should validate asterisks", function () {
    let validation = intus.validate(
      {
        quantities: [1, 2, 3],
      },
      {
        "quantities.*": [isMin(4)],
      }
    );

    expect(validation.passes()).toBe(false);
  });

  it("should replace error messages with asterisks", function () {
    let validation = intus.validate(
      {
        quantities: [1, 2],
      },
      {
        "quantities.*": [isMin(4)],
      },
      {
        "quantities.*": {
          isMin: "Should be min 4.",
        },
      }
    );

    expect(validation.passes()).toBe(false);
    expect(validation.errors()).toMatchObject({
      "quantities.0": "Should be min 4.",
      "quantities.1": "Should be min 4.",
    });
  });

  it("should add rule function on the fly", function () {
    let validation = intus.validate(
      {
        age: 17,
      },
      {
        age: [
          function isNotUnderage({value}) {
            function passes() {
              return value > 18;
            }

            function message(msg = "this will be replaced") {
              return msg.replaceAll(":value", value);
            }

            return {passes, message};
          },
        ],
      },
      {
        isNotUnderage: ":value is considered to be underage.",
      }
    );

    expect(validation.passes()).toBe(false);
    expect(validation.errors()).toMatchObject({
      age: "17 is considered to be underage.",
    });
  });

  it("allows replacing default error messages ", function () {
    let intus = new Intus({
      isRequired: "The :attribute field is required",
      "name.isRequired": "Name is definitely required",
    });

    let validation = intus.validate(
      {
        email: "not-valid",
      },
      {
        name: [isRequired()],
        age: [isRequired()],
        email: [isRequired(), isEmail()],
      }
    );

    expect(validation.errors()).toMatchObject({
      name: "Name is definitely required",
      age: "The age field is required",
      email: "Email must be a valid email.",
    });
  });
});
