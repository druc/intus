import {assertAccepted} from "../assertions";
import {getMessage} from "../lib";

export default function () {
  return function isAccepted({value, attribute, messages}) {
    return {
      passes() {
        return assertAccepted(value);
      },
      message(msg = ":attribute must be accepted.") {
        return msg
          .replaceAll(":value", value)
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
