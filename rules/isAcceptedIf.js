import {assertAccepted} from "../assertions";
import {getMessage, initializeAndGatherData, replaceWildcard} from "../lib";

export default function (other, otherValue) {
  return function isAcceptedIf({value, data, attribute, messages}) {
    let _other = replaceWildcard(other, attribute);
    let _data = initializeAndGatherData(other, data);

    return {
      passes() {
        if (assertAccepted(value)) {
          return true;
        }

        if (_data[_other] === otherValue) {
          return assertAccepted(value);
        }

        return true;
      },
      message(msg = ":attribute must be accepted if :other is :otherValue.") {
        return msg
          .replaceAll(":value", value)
          .replaceAll(":otherValue", otherValue)
          .replaceAll(":other", getMessage(_other, messages))
          .replaceAll(":attribute", attribute);
      },
    };
  };
}
