import {assertEmpty} from "../assertions";
import {getMessage} from "../lib";

export default function (...mimes) {
  return function isMime({value, attribute, messages}) {
    return {
      passes() {
        if (assertEmpty(value)) {
          return true;
        }
        return new RegExp(`${mimes.join("|").replace("*", ".+")}$`, "i").test(
          value?.type
        );
      },
      message(msg = ":attribute must be a file of type :mimes.") {
        return msg
          .replaceAll(":mimes", mimes.join(" / "))
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
