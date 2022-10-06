export default function assertEmpty(value) {
  if (value === null || value === undefined || value === "") {
    return true;
  }

  return Array.isArray(value) && value.length === 0;
}
