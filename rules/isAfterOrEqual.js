import {assertDate, assertEmpty} from "../assertions";
import {getMessage, initializeAndGatherData, replaceWildcard} from "../lib";

export default function (otherValue) {
  return function isAfterOrEqual({value, attribute, messages, data}) {
    let _otherValue = otherValue;

    if (typeof _otherValue === "string") {
      _otherValue = replaceWildcard(_otherValue, attribute);
      let _data = initializeAndGatherData(_otherValue, data);
      _otherValue = _data[_otherValue];
    }

    return {
      passes() {
        if (assertEmpty(value)) {
          return true;
        }

        if (!assertDate(value) || !assertDate(_otherValue)) {
          return true;
        }

        return value.getTime() >= _otherValue.getTime();
      },
      message(
        msg = ":attribute must be a date after or equal to :otherValue."
      ) {
        return msg
          .replaceAll(":value", value)
          .replaceAll(":attribute", getMessage(attribute, messages))
          .replaceAll(":otherValue", getMessage(_otherValue, messages));
      },
    };
  };
}
