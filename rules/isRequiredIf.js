import {assertEmpty, assertRequired} from "../assertions";
import {getMessage, initializeAndGatherData, replaceWildcard} from "../lib";

export default function (other, otherValue) {
  return function isRequiredIf({value, data, attribute, messages}) {
    let _other = replaceWildcard(other, attribute);
    let _data = initializeAndGatherData(_other, data);

    return {
      passes() {
        if (!assertEmpty(value)) {
          return true;
        }

        if (_data[_other] === otherValue) {
          return assertRequired(value);
        }

        return true;
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
