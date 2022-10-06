import {assertEmpty} from "../assertions";
import {getMessage, initializeAndGatherData, replaceWildcard} from "../lib";

export default function (...others) {
  return function isRequiredWithAll({value, data, attribute, messages}) {
    return {
      passes() {
        if (!assertEmpty(value)) {
          return true;
        }

        others = others.map(o => replaceWildcard(o, attribute));
        others.forEach(o => (data = initializeAndGatherData(o, data)));

        return !others.every(other => !assertEmpty(data[other]));
      },
      message(msg = ":attribute is required when :others are present.") {
        return msg
          .replaceAll(":value", value)
          .replaceAll(
            ":others",
            others.map(o => getMessage(o, messages)).join(" / ")
          )
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
