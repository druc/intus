export default function wildcardToAttribute(wildcardKey, modelKey) {
  let segments = modelKey.split(".");

  return wildcardKey
    .split(".")
    .reduce((c, segment, index) => {
      return [...c, segment === "*" ? segments[index] : segment];
    }, [])
    .join(".");
}
