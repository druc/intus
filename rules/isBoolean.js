import {getMessage} from "../lib";

export default function () {
  return function isBoolean({value, attribute, messages}) {
    return {
      passes() {
        return [true, false, 1, 0].includes(value);
      },
      message(msg = ":attribute must be a boolean.") {
        return msg
          .replaceAll(":value", value)
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
