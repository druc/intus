import {initializeAndGatherData} from "./index";

export default function parseData(data, rules) {
  let result = {};

  for (let attribute in rules) {
    result = {
      ...result,
      ...initializeAndGatherData(attribute, data),
    };
  }

  return result;
}
