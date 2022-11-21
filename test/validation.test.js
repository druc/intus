import {describe} from "vitest";
import {
  isDate,
  isEmail,
  isImage,
  isIn,
  isMax,
  isMin,
  isRequired,
  isRequiredIf,
  isRequiredWithout,
} from "../rules";
import intus from "../index";
import Intus from "../lib/intus";
import {makeFile} from "./helpers";

describe("validation", () => {
  let data = {
    date: "2022-11-21T09:44:05.943Z",
    reason: "purchase",
    description: null,
    type: null,
    lines: [
      {
        product: {
          id: 16,
          name: "Damian Cremin",
          category_id: 4,
          item_id: "703",
          um: "kg",
          is_sellable: true,
          available_in_online_store: true,
          available_in_physical_store: false,
          brand_id: 4,
          notes: null,
          description: null,
          user_id: 3401,
          media: [],
          category: {
            id: 4,
            name: "Kiana Roob",
            parent_id: null,
            created_at: "2022-11-21T09:06:28.000000Z",
            updated_at: "2022-11-21T09:06:28.000000Z",
          },
          qty: 6,
          exit_strategy: "FEFO - first expired, first transferred",
          is_batch_tracking: false,
        },
        batch_id: null,
        qty: 1,
        expiration_date: null,
        purchase_date: null,
        batch: null,
      },
      {
        product: {
          id: 1,
          name: "Odell Bergnaum IV",
          category_id: 1,
          item_id: "875",
          um: "kg",
          is_sellable: false,
          available_in_online_store: false,
          available_in_physical_store: true,
          brand_id: 1,
          notes: null,
          description: null,
          user_id: 3401,
          media: [],
          category: {
            id: 1,
            name: "Miss Claudie Jacobs Sr.",
            parent_id: null,
            created_at: "2022-11-21T09:06:28.000000Z",
            updated_at: "2022-11-21T09:06:28.000000Z",
          },
          qty: 6,
          exit_strategy: "FEFO - first expired, first transferred",
          is_batch_tracking: true,
        },
        batch_id: null,
        qty: null,
        expiration_date: null,
        purchase_date: null,
        batch: null,
      },
    ],
  };

  it("XXX should glass", function () {
    let v = intus.validate(data, {
      date: [isRequired(), isDate()],
      reason: [isRequired()],
      "lines.*.product": [isRequired()],
      "lines.*.qty": [isRequired(), isMin(1)],
      "lines.*.expiration_date": [
        isRequiredIf("lines.*.product.is_batch_tracking", true),
        isDate(),
      ],
      "lines.*.purchase_date": [
        isRequiredIf("lines.*.product.is_batch_tracking", true),
        isDate(),
      ],
    });
    console.log(v.errors());
    // expect(v.passes()).toBe(true);
  });
});
