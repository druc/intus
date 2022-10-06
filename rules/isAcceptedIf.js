import {assertAccepted} from "../assertions";
import {getMessage, initializeAndGatherData, replaceWildcard} from "../lib";

export default function (other, otherValue) {
  return function isAcceptedIf({value, data, attribute, messages}) {
    return {
      passes() {
        if (assertAccepted(value)) {
          return true;
        }

        other = replaceWildcard(other, attribute);
        data = initializeAndGatherData(other, data);

        if (data[other] === otherValue) {
          return assertAccepted(value);
        }

        return true;
      },
      message(msg = ":attribute must be accepted if :other is :otherValue.") {
        return msg
          .replaceAll(":value", value)
          .replaceAll(":otherValue", otherValue)
          .replaceAll(":other", getMessage(other, messages))
          .replaceAll(":attribute", attribute);
      },
    };
  };
}
