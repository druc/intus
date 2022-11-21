import {assertEmpty} from "../assertions";
import {getMessage, initializeAndGatherData, replaceWildcard} from "../lib";

export default function (...others) {
  return function isRequiredWithAll({value, data, attribute, messages}) {
    let _others = others.map(o => replaceWildcard(o, attribute));
    _others.forEach(o => (data = initializeAndGatherData(o, data)));

    return {
      passes() {
        if (!assertEmpty(value)) {
          return true;
        }

        return !_others.every(other => !assertEmpty(data[other]));
      },
      message(msg = ":attribute is required when :others are present.") {
        return msg
          .replaceAll(":value", value)
          .replaceAll(
            ":others",
            _others.map(o => getMessage(o, messages)).join(" / ")
          )
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
