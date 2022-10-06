export default function objectSet(target, key, value, overwrite) {
  let result = Array.isArray(target) ? [...target] : {...target};
  let segments = [...(Array.isArray(key) ? key : key.split("."))];
  let segment = segments.shift();

  if (segment === "*") {
    if (segments.length > 0) {
      for (let inner in result) {
        result[inner] = objectSet(result[inner], segments, value, overwrite);
      }
    } else if (overwrite) {
      for (let inner in result) {
        result[inner] = value;
      }
    }
  } else {
    if (segments.length > 0) {
      result[segment] = objectSet(result[segment], segments, value, overwrite);
    } else {
      if (
        overwrite ||
        result[segment] === null ||
        typeof result[segment] === "undefined"
      ) {
        result[segment] = value;
      }
    }
  }

  return result;
}
