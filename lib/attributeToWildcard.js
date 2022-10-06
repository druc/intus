export default function attributeToWildcard(attribute) {
  return attribute.replaceAll(/\d+/g, "*");
}
