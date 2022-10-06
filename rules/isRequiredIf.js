import {assertEmpty, assertRequired} from "../assertions";
import {getMessage, initializeAndGatherData, replaceWildcard} from "../lib";

export default function (other, otherValue) {
  return function isRequiredIf({value, data, attribute, messages}) {
    return {
      passes() {
        if (!assertEmpty(value)) {
          return true;
        }

        other = replaceWildcard(other, attribute);
        data = initializeAndGatherData(other, data);

        if (data[other] === otherValue) {
          return assertRequired(value);
        }

        return true;
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
