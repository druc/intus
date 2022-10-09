# intus

> **Note:** This project is at the very early stages of development and IS NOT yet intended for production
> applications.

**Intus** is a framework agnostic client-side validation library.

Apart from its ease of use and having a gazillion [rules](#rules) to pick from, what makes intus great is having rules based on
other fields, for example `requiredIf('otherField', 10)`, and the ability to validate nested fields and array items using
wildcards: `{"lines.*.qty: [isMin(1)]}`.

## Installation
```bash
npm install intus
```

## Usage
Import, provide data, rules, and messages (optional). Profit!

```js
import intus from "intus";

const validation = intus.validate(
  // data
  {
    name: "",
    email: "druc@pinsmile.com",
    password: "secret",
    password_confirmation: "not-secret",
    avatar: File,
    roles: ['moderator', 'supervisor']
  },
  // rules  
  {
    name: [isRequired()],
    email: [isRequired(), isEmail()],
    password: [isRequired(), isMin(8)],
    password_confirmation: [isRequired(), isSame('password')],
    avatar: [isImage()],
    "roles.*": [isIn("admin", "moderator", "supervisor")]
  },
  // overwrite error messages and field names
  { 
    "name.isRequired": "Name is super required.",
    "password_confirmation": "password confirmation"
  }
);

validation.passes(); // true/false
validation.errors(); // object with fieldName: firstErrorMessage
// {
//   "name": "Name is super required.",
//   "password_confirmation": "The password confirmation must be the same as password.",
//   "avatar": "The avatar must be an image."
// }
```

## <a id="rules">Available validation rules</a>
*Most* rules are optional by default. If the field is empty (null/undefined/empty string), the validation will pass; so make sure you add in `isRequired()`.

| Rules                               |                         |                                               |
|-------------------------------------|-------------------------|-----------------------------------------------|
| [isAccepted](#isAccepted)           | [isGt](#isGt)           | [isNotRegex](#isNotRegex)                     |
| [isAcceptedIf](#isAcceptedIf)       | [isGte](#isGte)         | [isNumeric](#isNumeric)                       |
| [isAfter](#isAfter)                 | [isImage](#isImage)     | [isRegex](#isRegex)                           |
| [isAfterOrEqual](#isAfterOrEqual)   | [isIn](#isIn)           | [isRequired](#isRequired)                     |
| [isArray](#isArray)                 | [isInteger](#isInteger) | [isRequiredIf](#isRequiredIf)                 |
| [isBefore](#isBefore)               | [isIp](#isIp)           | [isRequiredIfAccepted](#isRequiredIfAccepted) |
| [isBeforeOrEqual](#isBeforeOrEqual) | [isJSON](#isJSON)       | [isRequiredUnless](#isRequiredUnless)         |
| [isBetween](#isBetween)             | [isLt](#isLt)           | [isRequiredWith](#isRequiredWith)             |
| [isBoolean](#isBoolean)             | [isLte](#isLte)         | [isRequiredWithAll](#isRequiredWithAll)       |
| [isDate](#isDate)                   | [isMax](#isMax)         | [isRequiredWithout](#isRequiredWithout)       |
| [isDistinct](#isDistinct)           | [isMime](#isMime)       | [isRequiredWithoutAll](#isRequiredWithoutAll) |
| [isEmail](#isEmail)                 | [isMin](#isMin)         | [isSame](#isSame)                             |          
| [isExtension](#isExtension)         | [isNotIn](#isNotIn)     | [isUrl](#isUrl)                               | 

#### <a id="isAccepted">isAccepted()</a>
The field under validation must be `"yes"`, `"on"`, `1`, or `true`. This is useful for validating "Terms of Service" acceptance or
similar fields.

#### <a id="isAcceptedIf">isAcceptedIf(anotherfield, value)</a>
The field under validation must be `"yes"`, `"on"`, `1`, or `true` if another field is equal to a specified value. This
is useful for validating "Terms of Service" acceptance or similar fields.

#### <a id="isAfter">isAfter(date)</a>
The field under validation must be a value after a given date/another field that is itself a `Date` object.

#### <a id="isAfterOrEqual">isAfterOrEqual(date)</a>
The field under validation must be a value after or equal to a given date/another field that is itself a `Date` object.

#### <a id="isArray">isArray()</a>
The field under validation must be a valid array.

#### <a id="isBefore">isBefore(date)</a>
The field under validation must be a value preceding a given date/another field that is itself a `Date` object.

#### <a id="isBeforeOrEqual">isBeforeOrEqual(date)</a>
The field under validation must be a value preceding or equal to a given date/another field that is itself a `Date` object.

#### <a id="isBetween">isBetween(min, max)</a>
The field under validation must be a number between or equal to the given `min` and `max`.

#### <a id="isBoolean">isBoolean()</a>
The field under validation must be one of: `true`, `false`, `1`, `0`.

#### <a id="isDate">isDate()</a>
The field under validation must be a valid `Date` object.

#### <a id="isDistinct">isDistinct()</a>
When validating arrays, the field must not have any duplicate values:

```js
{
  "foo.*.id": [isDistinct()]
}
```

`isDistinct()` uses loose variable comparisons by default. To use strict comparisons, you may pass `strict` as
parameter:

```js
{
  "foo.*.id": [isDistinct("strict")]
}
```

You may also pass `ignoreCase` to make the rule ignore capitalization differences:

```js
{
  "foo.*.id": [isDistinct("strict", "ignoreCase")]
}
```

#### <a id="isEmail">isEmail()</a>
The field under validation must be formatted as an email address.

#### <a id="isExtension">isExtension(...extensions)</a>
The file must have an extension present in the provided list.

```js
{
  "document": [isExtension("pdf", "txt", "xls")]
}
```

#### <a id="isGt">isGt(anotherfield)</a>
The field under validation must be a number greater than the given field.

#### <a id="isGte">isGte(anotherfield)</a>
The field under validation must be a number greater or equal to the given field.

#### <a id="isImage">isImage()</a>
The file must have one of the following extensions: jpg|svg|jpeg|png|bmp|gif|webp.

#### <a id="isIn">isIn(...options)</a>
The field under validation must be a value present in the given options.

```js
{
  "status": [isIn("draft", "published")]
}
```

#### <a id="isInteger">isInteger()</a>
The field under validation must be a valid integer. Strings like `"1"` work as well.

#### <a id="isIp">isIp()</a>
The field under validation must be an IP (version 4 or 6).

#### <a id="isJSON">isJSON()</a>
The field under validation must be a valid JSON string.

#### <a id="isLt">isLt(anotherField)</a>
The field under validation must be a number smaller than the given field.

#### <a id="isLte">isLte(anotherField)</a>
The field under validation must be a number smaller or equal to the given field.

#### <a id="isMax">isMax(max)</a>
The field under validation must be less than or equal to a maximum value. This works with numerics by comparing their value, strings and arrays by comparing their length, and files by comparing their size in MB.

#### <a id="isMime">isMime(...mimes)</a>
The file must match one of the given mime types:
```js
{
  "document": [isMime("text/*", "application/pdf")]
}
```

#### <a id="isMin">isMin(min)</a>
The field under validation must have a minimum value. This works with numerics by comparing their value, strings and arrays by comparing their length, and files by comparing their size in MB.

#### <a id="isNotIn">isNotIn(...options)</a>
The field under validation must be a value present in the given options.

#### <a id="isNotRegex">isNotRegex(regex)</a>
The field under validation must not match the given regular expression.

#### <a id="isNumeric">isNumeric()</a>
The field under validation must be numeric.

#### <a id="isRegex">isRegex(regex)</a>
The field under validation must match the given regular expression.

#### <a id="isRequired">isRequired()</a>
The field under validation must be present in the input data and not empty. A field is considered "empty" if one of the following conditions are true:
- The value is `null`.
- The value is an empty string.
- The value is an empty array.

#### <a id="isRequiredIf">isRequiredIf(anotherField, value)</a>
The field under validation must be present and not empty if the `anotherfield` field is equal to `value`.

#### <a id="isRequiredIfAccepted">isRequiredIfAccepted(anotherField)</a>
The field under validation must be present and not empty if the `anotherfield` is (accepted)[#isAccepted].

#### <a id="isRequiredUnless">isRequiredUnless(anotherField, value)</a>
The field under validation must be present and not empty unless the `anotherfield` is equal to `value`.

#### <a id="isRequiredWith">isRequiredWith(...otherFields)</a>
The field under validation must be present and not empty only if any of the `otherFields` are present and not empty.

#### <a id="isRequiredWithAll">isRequiredWithAll(...otherFields)</a>
The field under validation must be present and not empty only if all of the `otherFields` are present and not empty.

#### <a id="isRequiredWithout">isRequiredWithout(...otherFields)</a>
The field under validation must be present and not empty only when any of the `otherFields` are empty or not present.

#### <a id="isRequiredWithoutAll">isRequiredWithoutAll(...otherFields)</a>
The field under validation must be present and not empty only when all of the `otherFields` are empty or not present.

#### <a id="isSame">isSame(anotherField)</a>
The given field must match the `anotherField` under validation.

#### <a id="isUrl">isUrl()</a>
The field under validation must be a valid URL.

## Translations / overwriting error messages
You can overwrite messages globally, or per individual validation.  

For a global overwrite, ideally you would create a wrapper around intus and set its `message` property to an object having keys as rule or field names, and values as the desired messages. 

The following snippet overwrites *all* rule messages, but you can, of course, overwrite only the ones you want.
```js
// myIntus.js
import intus from "intus";

intus.messages = {
  "isAccepted": ":attribute must be accepted.",
  "isAcceptedIf": ":attribute must be accepted if :other is :otherValue.",
  "isAfter": ":attribute must be a date after :otherValue.",
  "isAfterOrEqual": ":attribute must be a date after or equal to :otherValue.",
  "isArray": ":attribute must be a valid array.",
  "isBefore": ":attribute must be a date before :otherValue.",
  "isBeforeOrEqual": ":attribute must be a date before or equal to :otherValue.",
  "isBetween": ":attribute must be between or equal to :min and :max.",
  "isBoolean": ":attribute must be a boolean.",
  "isDate": ":attribute must be a valid date.",
  "isDistinct": ":attribute must be distinct.",
  "isEmail": ":attribute must be a valid email.",
  "isExtension": ":attribute must be a file of type :extensions.",
  "isGt": ":attribute must be greater than :otherValue.",
  "isGte": ":attribute must be greater or equal to :otherValue.",
  "isImage": ":attribute must be an image.",
  "isIn": ":attribute must be one of :options.",
  "isInteger": ":attribute must be an integer.",
  "isIp": ":attribute must be a valid IP address.",
  "isJSON": ":attribute must be a valid JSON.",
  "isLt": ":attribute must be less than :otherValue.",
  "isLte": ":attribute must be less or equal to :otherValue.",
  "isMax": ":attribute must be at most :max.",
  "isMax.string": ":attribute must be at most :max characters long.",
  "isMax.array": ":attribute must have at most :max items.",
  "isMax.file": ":attribute must be at most :maxMB.",
  "isMime": ":attribute must be a file of type :mimes.",
  "isMin": ":attribute must be at least :min.",
  "isMin.string": ":attribute must be at least :min characters long.",
  "isMin.array": ":attribute must have at least :min items.",
  "isMin.file": ":attribute must be at least :minMB.",
  "isNotIn": ":attribute must not be one of :options.",
  "isNotRegex": ":attribute must not match regex :regex.",
  "isNumeric": ":attribute must be a number.",
  "isRegex": ":attribute must match regex :regex.",
  "isRequired": ":attribute is required.",
  "isRequiredIf": ":attribute is required if :other is :otherValue.",
  "isRequiredIfAccepted": ":attribute is required if :other is accepted.",
  "isRequiredUnless": ":attribute is required if :other is :otherValue.",
  "isRequiredWith": ":attribute is required when :others is present.",
  "isRequiredWithAll": ":attribute is required when :others are present.",
  "isRequiredWithout": ":attribute is required when :others is missing.",
  "isRequiredWithoutAll": ":attribute is required when :others are missing.",
  "isSame": ":attribute must be the same as :other.",
  "isUrl": ":attribute must be a valid URL.",
    
  // you can add field names as well
  "first_name": "prénom",
  "last_name": "nom de famille",
}

export default intus;


// Then import and use the customized version of intus..
import intus from "./myIntus"
```

To overwrite messages and field names per individual validation, you can pass an object as the third parameter to the `validate` function:
```js
let validation = intus.validate(
  {
    cart_items: [{id: 1, qty: 2}]
  },
  {
    "cart_items.*.id": [isRequired()],
    "cart_items.*.qty": [isRequired()],
  },
  {
    "cart_items.*.id": "product", // overwrites "cart_items.0.id" to "product" 
    "cart_items.*.qty.isRequired": "Qty is absolutely required", // overwrites the entire isRequired message
  }
);
```

## Most rules are optional
If fields have an empty value (null/undefined/empty string), the validation will pass.

For example:
```js
let validation = intus.validate(
  {email: ""}, 
  {email: [isEmail()]}
);

validation.passes(); // true. Think of it as the rule saying "hey, you haven't actually passed me anything to validate."
```

What you probably want is:

```js
let validation = intus.validate(
  {email: ""}, 
  {email: [isRequired(), isEmail()]}
);

validation.passes(); // false because isRequired fails

let validation = intus.validate(
    {email: "abc"},
    {email: [isRequired(), isEmail()]} // false because isEmail fails
);
```


## Custom validation rules
To create a custom rule, create a new file called `/rules/my-rule.js`, and use the following snippet as your starting point.

```js
// my-rules/isLowercase.js
import {getMessage} from "intus";

export default function () {
  return function isLowercase({value, attribute, messages}) {
    return {
      passes() {
        return value === value.toLowerCase();
      },
      message(msg = ":attribute must be lowercase.") {
        return msg.replaceAll(":attribute", getMessage(attribute, messages));
      },
    };
  };
}
```
The `passes()` method should return `true/false` to indicate wether or not the rule passed, while the `message()` method should return a string indicating the error.

Then you can use your custom rule as you would use any other intus rules.
```js
import isLowercase from "my-rules/isLowercase.js";

let validation = intus.validate(
    {username: "AbC"},
    {username: [isLowercase()]}
);

validation.validate(); // false
```

For more complex rules, browse the [rules directory](https://github.com/druc/intus/tree/master/rules) for inspiration.

## Credits
This library stands on the shoulders of giants. Many ideas have come from the following projects:
- [laravel/laravel](https://github.com/laravel/laravel)
- [validator.js](https://github.com/validatorjs/validator.js)
- [vee-validate](https://github.com/logaretm/vee-validate)
- [@kingshott/iodine](https://github.com/mattkingshott/iodine)
- [dottie](https://github.com/mickhansen/dottie.js)