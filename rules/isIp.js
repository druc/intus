import {assertEmpty} from "../assertions";
import {getMessage} from "../lib";

export default function () {
  return function isIp({value, attribute, messages}) {
    return {
      passes() {
        if (assertEmpty(value)) {
          return true;
        }

        return new RegExp(
          "^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
        ).test(String(value));
      },
      message(msg = ":attribute must be a valid IP address.") {
        return msg
          .replaceAll(":value", value)
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
