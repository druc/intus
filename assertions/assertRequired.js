import {assertEmpty} from "./index";

export default function assertRequired(value) {
  return !assertEmpty(value);
}
