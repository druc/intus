import {assertEmpty} from "../assertions";
import {getMessage} from "../lib";

export default function () {
  return function isInteger({value, attribute, messages}) {
    return {
      passes() {
        if (assertEmpty(value)) {
          return true;
        }

        return new RegExp("^-?[0-9]+$").test(String(value));
      },
      message(msg = ":attribute must be an integer.") {
        return msg
          .replaceAll(":value", value)
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
