import {getMessage} from "../lib";
import {assertEmpty} from "../assertions";

export default function () {
  return function isJSON({value, attribute, messages}) {
    return {
      passes() {
        if (assertEmpty(value)) {
          return true;
        }

        try {
          const obj = JSON.parse(value);
          return !!obj && typeof obj === "object";
        } catch (e) {}
        return false;
      },
      message(msg = ":attribute must be a valid JSON.") {
        return msg
          .replaceAll(":value", value)
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
