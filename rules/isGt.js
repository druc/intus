import {assertEmpty} from "../assertions";
import {getMessage, initializeAndGatherData, replaceWildcard} from "../lib";

export default function (other) {
  return function isGt({value, data, attribute, messages}) {
    return {
      passes() {
        if (assertEmpty(value)) {
          return true;
        }

        other = replaceWildcard(other, attribute);
        data = initializeAndGatherData(other, data);

        if (assertEmpty(data[other])) {
          return true;
        }

        return Number(value) > Number(data[other]);
      },
      message(msg = ":attribute must be greater than :otherValue.") {
        return msg
          .replaceAll(":value", value)
          .replaceAll(":otherValue", data[other])
          .replaceAll(":other", getMessage(other, messages))
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
