import {assertEmpty} from "../assertions";
import {bytesToMb, getMessage} from "../lib";

export default function (max) {
  return function isMax({value, attribute, messages}) {
    return {
      passes() {
        if (assertEmpty(value)) {
          return true;
        }

        if (typeof value === "string") {
          return value.length <= Number(max);
        }

        if (Array.isArray(value)) {
          return value.length <= Number(max);
        }

        if (value.constructor?.name === "File") {
          return bytesToMb(value.size) <= Number(max);
        }

        return Number(value) <= Number(max);
      },
      message() {
        let segment = `${attribute}.isMax`;

        let msg = getMessage(
          segment,
          messages,
          ":attribute must be at most :max."
        );

        if (typeof value === "string") {
          msg = getMessage(
            `${segment}.string`,
            messages,
            ":attribute must be at most :max characters long."
          );
        }

        if (Array.isArray(value)) {
          msg = getMessage(
            `${segment}.array`,
            messages,
            ":attribute must have at most :max items."
          );
        }

        if (value.constructor?.name === "File") {
          msg = getMessage(
            `${segment}.file`,
            messages,
            ":attribute must be at most :maxMB."
          );
        }

        return msg
          .replaceAll(":max", max)
          .replaceAll(":value", value)
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
