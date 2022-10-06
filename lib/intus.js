import Validation from "./validation";
import {arrayToDot} from "./index";

export default class Intus {
  constructor(messages = {}) {
    this.messages = messages;
  }

  validate(data, rules, messages = {}) {
    return new Validation(
      data,
      rules,
      arrayToDot({
        ...this.messages,
        ...messages,
      })
    );
  }
}
