import {assertEmpty} from "../assertions";
import {getMessage} from "../lib";

export default function () {
  return function isImage({value, attribute, messages}) {
    return {
      passes() {
        if (assertEmpty(value)) {
          return true;
        }
        return new RegExp(/\.(jpg|svg|jpeg|png|bmp|gif|webp)$/i).test(
          value.name
        );
      },
      message(msg = ":attribute must be an image.") {
        return msg
          .replaceAll(":value", value)
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
