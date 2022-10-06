import {assertEmpty} from "../assertions";
import {getMessage} from "../lib";

export default function (...options) {
  return function isIn({value, attribute, messages}) {
    return {
      passes() {
        if (assertEmpty(value)) {
          return true;
        }
        return options.includes(value.toString());
      },
      message(msg = ":attribute must be one of :options.") {
        return msg
          .replaceAll(":value", value)
          .replaceAll(
            ":options",
            options.map(o => getMessage(o, messages)).join(" / ")
          )
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
