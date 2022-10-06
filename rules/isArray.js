import {getMessage} from "../lib";
import {assertEmpty} from "../assertions";

export default function () {
  return function isArray({value, attribute, messages}) {
    return {
      passes() {
        if (assertEmpty(value)) {
          return true;
        }

        return Array.isArray(value);
      },
      message(msg = ":attribute must be a valid array.") {
        return msg
          .replaceAll(":value", value)
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
