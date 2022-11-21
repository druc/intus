import {assertEmpty} from "../assertions";
import {getMessage, initializeAndGatherData, replaceWildcard} from "../lib";

export default function (other) {
  return function isLt({value, data, attribute, messages}) {
    let _other = replaceWildcard(other, attribute);
    let _data = initializeAndGatherData(_other, data);

    return {
      passes() {
        if (assertEmpty(value)) {
          return true;
        }

        if (assertEmpty(_data[_other])) {
          return true;
        }

        return Number(value) < Number(_data[_other]);
      },
      message(msg = ":attribute must be less than :otherValue.") {
        return msg
          .replaceAll(":value", value)
          .replaceAll(":otherValue", _data[_other])
          .replaceAll(":other", getMessage(_other, messages))
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
