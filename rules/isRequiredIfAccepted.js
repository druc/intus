import {assertAccepted, assertEmpty, assertRequired} from "../assertions";
import {getMessage, initializeAndGatherData, replaceWildcard} from "../lib";

export default function (other) {
  return function isRequiredIfAccepted({value, data, attribute, messages}) {
    let _other = replaceWildcard(other, attribute);
    let _data = initializeAndGatherData(other, data);

    return {
      passes() {
        if (!assertEmpty(value)) {
          return true;
        }

        if (!assertAccepted(_data[_other])) {
          return true;
        }

        return assertRequired(value);
      },
      message(msg = ":attribute is required if :other is accepted.") {
        return msg
          .replaceAll(":value", value)
          .replaceAll(":otherValue", _data[_other])
          .replaceAll(":other", getMessage(_other, messages))
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
