import {assertEmpty} from "../assertions";
import {getMessage} from "../lib";

export default function (regex) {
  return function isNotRegex({value, attribute, messages}) {
    return {
      passes() {
        if (assertEmpty(value)) {
          return true;
        }

        return !regex.test(value);
      },
      message(msg = ":attribute must not match regex :regex.") {
        return msg
          .replaceAll(":regex", regex)
          .replaceAll(":value", value)
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
