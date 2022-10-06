export default function getMessage(key, messages, defaultMessage = null) {
  if (messages[key]) return messages[key];

  for (let msg in messages) {
    if (msg.includes("*")) {
      let pattern = new RegExp(msg.replaceAll("*", "[^.]*") + "$");
      if (pattern.test(key)) {
        return messages[msg];
      }
    }
  }

  return defaultMessage ? defaultMessage : key;
}
