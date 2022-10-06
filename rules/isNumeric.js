import {assertEmpty} from "../assertions";
import {getMessage} from "../lib";

export default function () {
  return function isNumeric({value, attribute, messages}) {
    return {
      passes() {
        if (assertEmpty(value)) {
          return true;
        }

        return !isNaN(Number(value)) && isFinite(value);
      },
      message(msg = ":attribute must be a number.") {
        return msg
          .replaceAll(":value", value)
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
