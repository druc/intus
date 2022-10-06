export default function parseRules(parsedData, rules) {
  rules = {...rules};

  for (let attribute in rules) {
    if (attribute.includes("*")) {
      rules = {
        ...rules,
        ...parsedWildcardRules(parsedData, attribute, rules[attribute]),
      };

      delete rules[attribute];
    }
  }

  return rules;
}

function parsedWildcardRules(parsedData, attribute, rules) {
  let parsedRules = {};
  let pattern = new RegExp(attribute.replaceAll("*", "[^.]*") + "$");

  for (let attr in parsedData) {
    if (pattern.test(attr)) {
      rules.forEach(rule => {
        parsedRules[attr] = parsedRules[attr] || [];
        parsedRules[attr].push(rule);
      });
    }
  }

  return parsedRules;
}
