import {assertEmpty} from "../assertions";
import {getMessage, initializeAndGatherData, replaceWildcard} from "../lib";

export default function (other, otherValue) {
  return function isRequiredUnless({value, data, attribute, messages}) {
    let _other = replaceWildcard(other, attribute);
    let _data = initializeAndGatherData(other, data);

    return {
      passes() {
        if (!assertEmpty(value)) {
          return true;
        }

        return _data[_other] === otherValue;
      },
      message(msg = ":attribute is required if :other is :otherValue.") {
        return msg
          .replaceAll(":value", value)
          .replaceAll(":otherValue", otherValue)
          .replaceAll(":other", getMessage(_other, messages))
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
