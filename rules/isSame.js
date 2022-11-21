import {getMessage, initializeAndGatherData, replaceWildcard} from "../lib";

export default function (other) {
  return function isSame({value, data, attribute, messages}) {
    let _other = replaceWildcard(other, attribute);
    let _data = initializeAndGatherData(_other, data);

    return {
      passes() {
        return value?.toString() === _data[_other]?.toString();
      },
      message(msg = ":attribute must be the same as :other.") {
        return msg
          .replaceAll(":value", value)
          .replaceAll(":otherValue", _data[_other])
          .replaceAll(":other", getMessage(_other, messages))
          .replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
