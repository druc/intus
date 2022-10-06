import {assertAccepted, assertEmpty, assertRequired} from "../assertions";
import {getMessage, initializeAndGatherData, replaceWildcard} from "../lib";

export default function (other) {
  return function isRequiredIfAccepted({value, data, attribute, messages}) {
    return {
      passes() {
        if (!assertEmpty(value)) {
          return true;
        }

        other = replaceWildcard(other, attribute);
        data = initializeAndGatherData(other, data);

        if (!assertAccepted(data[other])) {
          return true;
        }

        return assertRequired(value);
      },
      message(msg = ":attribute is required if :other is accepted.") {
        return msg
          .replaceAll(":value", value)
          .replaceAll(":otherValue", data[other])
          .replaceAll(":other", getMessage(other, messages))
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
