import {
  attributeToWildcard,
  parseData,
  parseRules,
  snakeToWords,
} from "./index";

export default class Validation {
  /**
   * @type {*}
   * @private
   */
  _errors = undefined;

  constructor(masterData, masterRules, messages = {}) {
    this.messages = messages;
    this.data = parseData(masterData, masterRules);
    this.rules = parseRules(this.data, masterRules);
  }

  passes() {
    this._errors = {};

    for (let attribute in this.rules) {
      for (let rule in this.rules[attribute]) {
        let validation = this.rules[attribute][rule]({
          value: this.data[attribute],
          data: this.data,
          attribute,
          messages: this.messages,
        });

        if (!validation.passes()) {
          let message = this.overwrittenMessage(attribute, rule);
          this._errors[attribute] = snakeToWords(validation.message(message));
          break;
        }
      }
    }

    return Object.keys(this._errors).length === 0;
  }

  /**
   * @private
   */
  overwrittenMessage(attribute, rule) {
    let message =
      this.messages[
        `${attributeToWildcard(attribute)}.${this.rules[attribute][rule].name}`
      ];

    if (!message) {
      message = this.messages[this.rules[attribute][rule].name];
    }

    return message;
  }

  errors() {
    if (typeof this._errors === "undefined") {
      this.passes();
    }

    return this._errors;
  }
}
