import {assertDate, assertEmpty} from "../assertions";
import {getMessage, initializeAndGatherData, replaceWildcard} from "../lib";

export default function (otherValue) {
  return function isBeforeOrEqual({value, attribute, messages, data}) {
    return {
      passes() {
        if (assertEmpty(value)) {
          return true;
        }

        if (typeof otherValue === "string") {
          otherValue = replaceWildcard(otherValue, attribute);
          data = initializeAndGatherData(otherValue, data);
          otherValue = data[otherValue];
        }

        if (!assertDate(value) || !assertDate(otherValue)) {
          return true;
        }

        return value.getTime() <= otherValue.getTime();
      },
      message(
        msg = ":attribute must be a date before or equal to :otherValue."
      ) {
        return msg
          .replaceAll(":value", value)
          .replaceAll(":attribute", getMessage(attribute, messages))
          .replaceAll(":otherValue", getMessage(otherValue, messages));
      },
    };
  };
}
