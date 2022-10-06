import {assertEmpty} from "../assertions";
import {bytesToMb, getMessage} from "../lib";

export default function (min) {
  return function isMin({value, attribute, messages}) {
    return {
      passes() {
        if (assertEmpty(value)) {
          return true;
        }

        if (typeof value === "string") {
          return value.length >= Number(min);
        }

        if (Array.isArray(value)) {
          return value.length >= Number(min);
        }

        if (value.constructor?.name === "File") {
          return bytesToMb(value.size) >= Number(min);
        }

        return Number(value) >= Number(min);
      },
      message() {
        let segment = `${attribute}.isMin`;

        let msg = getMessage(
          segment,
          messages,
          ":attribute must be at least :min."
        );

        if (typeof value === "string") {
          msg = getMessage(
            `${segment}.string`,
            messages,
            ":attribute must be at least :min characters long."
          );
        }

        if (Array.isArray(value)) {
          msg = getMessage(
            `${segment}.array`,
            messages,
            ":attribute must have at least :min items."
          );
        }

        if (value.constructor?.name === "File") {
          msg = getMessage(
            `${segment}.file`,
            messages,
            ":attribute must be at least :minMB."
          );
        }

        return msg
          .replaceAll(":min", min)
          .replaceAll(":value", value)
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
