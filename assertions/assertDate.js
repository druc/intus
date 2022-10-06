export default function assertDate(value) {
  return value && Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value);
}
