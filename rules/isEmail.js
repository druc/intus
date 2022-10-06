import {assertEmpty} from "../assertions";
import {getMessage} from "../lib";

export default function () {
  return function isEmail({value, attribute, messages}) {
    return {
      passes() {
        if (assertEmpty(value)) {
          return true;
        }

        return new RegExp(
          "^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$"
        ).test(String(value).toLowerCase());
      },
      message(msg = ":attribute must be a valid email.") {
        return msg
          .replaceAll(":value", value)
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
