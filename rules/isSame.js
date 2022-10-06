import {getMessage, initializeAndGatherData, replaceWildcard} from "../lib";

export default function (other) {
  return function isSame({value, data, attribute, messages}) {
    return {
      passes() {
        other = replaceWildcard(other, attribute);
        data = initializeAndGatherData(other, data);
        return value?.toString() === data[other]?.toString();
      },
      message(msg = ":attribute must be the same as :other.") {
        return msg
          .replaceAll(":value", value)
          .replaceAll(":otherValue", data[other])
          .replaceAll(":other", getMessage(other, messages))
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
