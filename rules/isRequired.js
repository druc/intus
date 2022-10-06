import {assertRequired} from "../assertions";
import {getMessage} from "../lib";

export default function () {
  return function isRequired({value, attribute, messages}) {
    return {
      passes() {
        return assertRequired(value);
      },
      message(msg = ":attribute is required.") {
        return msg
          .replaceAll(":value", getMessage(value, messages))
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
