import {assertDate, assertEmpty} from "../assertions";
import {getMessage} from "../lib";

export default function () {
  return function isDate({value, attribute, messages}) {
    return {
      passes() {
        if (assertEmpty(value)) {
          return true;
        }

        return assertDate(value);
      },
      message(msg = ":attribute must be a valid date.") {
        return msg
          .replaceAll(":value", value)
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
