export default function assertUniqueArray(arr) {
  let map = {};
  let i;
  let size;
  for (i = 0, size = arr.length; i < size; i++) {
    if (map[arr[i]]) {
      return false;
    }
    map[arr[i]] = true;
  }
  return true;
}
