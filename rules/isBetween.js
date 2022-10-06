import {assertEmpty} from "../assertions";
import {getMessage} from "../lib";

export default function (min, max) {
  return function isBetween({value, attribute, messages}) {
    return {
      passes() {
        if (assertEmpty(value)) {
          return true;
        }

        return Number(value) >= Number(min) && Number(value) <= Number(max);
      },
      message(msg = ":attribute must be between or equal to :min and :max.") {
        return msg
          .replaceAll(":min", min)
          .replaceAll(":max", max)
          .replaceAll(":value", value)
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
