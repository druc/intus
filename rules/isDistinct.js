import {assertEmpty, assertUniqueArray} from "../assertions";
import {attributeToWildcard, getMessage} from "../lib";

export default function (...options) {
  return function isDistinct({value, data, attribute, messages, masterRules}) {
    return {
      passes() {
        if (assertEmpty(value)) {
          return true;
        }

        let wildcardAttribute = attributeToWildcard(attribute);
        let strict = options.includes("strict");
        let ignoreCase = options.includes("ignoreCase");
        let values = [];

        let pattern = new RegExp(
          wildcardAttribute.replaceAll("*", "[^.]*") + "$"
        );
        for (let key in data) {
          if (pattern.test(key)) {
            if (ignoreCase) {
              values.push(data[key]?.toString()?.toLowerCase());
            } else {
              values.push(data[key]);
            }
          }
        }

        if (strict) {
          return new Set(values).size === values.length;
        }

        return assertUniqueArray(values);
      },
      message(msg = ":attribute must be distinct.") {
        return msg
          .replaceAll(":value", value)
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
