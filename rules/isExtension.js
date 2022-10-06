import {assertEmpty} from "../assertions";
import {getMessage} from "../lib";

export default function (...extensions) {
  return function isExtension({value, attribute, messages}) {
    return {
      passes() {
        if (assertEmpty(value)) {
          return true;
        }

        return new RegExp(`.(${extensions.join("|")})$`, "i").test(value.name);
      },
      message(msg = ":attribute must be a file of type :extensions.") {
        return msg
          .replaceAll(":extensions", extensions.join(" / "))
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
