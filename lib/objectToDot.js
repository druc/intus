export default function objectToDot(data, prepend = "") {
  let result = {};

  for (let key in data) {
    if (data[key] !== null && typeof data[key] === "object") {
      result = {
        ...result,
        ...objectToDot(data[key], prepend + key + "."),
      };
    } else {
      result[prepend + key] = data[key];
    }
  }

  return result;
}
