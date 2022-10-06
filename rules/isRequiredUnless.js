import {assertEmpty} from "../assertions";
import {getMessage, initializeAndGatherData, replaceWildcard} from "../lib";

export default function (other, otherValue) {
  return function isRequiredUnless({value, data, attribute, messages}) {
    return {
      passes() {
        if (!assertEmpty(value)) {
          return true;
        }

        other = replaceWildcard(other, attribute);
        data = initializeAndGatherData(other, data);

        if (data[other] === otherValue) {
          return true;
        }

        return false;
      },
      message(msg = ":attribute is required if :other is :otherValue.") {
        return msg
          .replaceAll(":value", value)
          .replaceAll(":otherValue", otherValue)
          .replaceAll(":other", getMessage(other, messages))
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
