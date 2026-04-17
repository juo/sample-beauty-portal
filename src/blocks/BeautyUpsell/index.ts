import { defineBlock } from "@juo/blocks";
import { createReactRenderer } from "@juo/blocks/react";
import type { FromExtendedSchema, ExtendedJSONSchema } from "json-schema-to-ts";
import { blockLocales } from "../../locales";
import { BeautyUpsell as BeautyUpsellComponent } from "./BeautyUpsell";

type Extensions = {
  "x-juo-control-type": "inline-text" | "stepper" | "number";
  "x-juo-group": string;
  "x-juo-visible-when": { prop: string; eq: string };
};

type BeautySchema = ExtendedJSONSchema<Extensions>;

const schema = {
  type: "object",
  properties: {
    props: {
      type: "object",
      properties: {
        title: {
          type: "string",
          "x-juo-control-type": "inline-text",
          default: "You might also love",
        },
        addLabel: {
          type: "string",
          "x-juo-control-type": "inline-text",
          default: "Add to box",
        },
        addedLabel: {
          type: "string",
          "x-juo-control-type": "inline-text",
          default: "Added",
        },
        emptyMessage: {
          type: "string",
          "x-juo-control-type": "inline-text",
          default: "No recommendations available.",
        },
        layout: {
          type: "string",
          enum: ["carousel", "grid"],
          title: "Layout",
          "x-juo-group": "layout",
          default: "carousel",
        },
        columns: {
          type: "integer",
          title: "Columns (grid only)",
          "x-juo-control-type": "stepper",
          "x-juo-group": "layout",
          "x-juo-visible-when": { prop: "layout", eq: "grid" },
          minimum: 1,
          maximum: 6,
          default: 3,
        },
        cardWidth: {
          type: "integer",
          title: "Card width (px, carousel only)",
          "x-juo-control-type": "number",
          "x-juo-group": "layout",
          "x-juo-visible-when": { prop: "layout", eq: "carousel" },
          minimum: 80,
          default: 144,
        },
        showPrice: {
          type: "boolean",
          title: "Show price",
          "x-juo-group": "layout",
          default: true,
        },
        fallbackImageUrl: {
          type: "string",
          title: "Fallback image URL",
          "x-juo-group": "media",
          default: "/assets/beauty-upsell-default.svg",
        },
        fallbackImageAlt: {
          type: "string",
          title: "Fallback image alt text",
          "x-juo-control-type": "inline-text",
          "x-juo-group": "media",
          default: "Beauty product",
        },
      },
      required: [
        "title",
        "addLabel",
        "addedLabel",
        "emptyMessage",
        "layout",
        "columns",
        "cardWidth",
        "showPrice",
        "fallbackImageUrl",
        "fallbackImageAlt",
      ],
      additionalProperties: false,
    },
  },
  required: ["props"],
  additionalProperties: false,
} as const satisfies BeautySchema;

type Schema = FromExtendedSchema<Extensions, typeof schema>;

export const BeautyUpsell = defineBlock<Schema>("BeautyUpsell", {
  group: "theme",
  schema,
  initialValue: () => ({
    props: {
      title: "You might also love",
      addLabel: "Add to box",
      addedLabel: "Added",
      emptyMessage: "No recommendations available.",
      layout: "carousel",
      columns: 3,
      cardWidth: 144,
      showPrice: true,
      fallbackImageUrl: "/assets/beauty-upsell-default.svg",
      fallbackImageAlt: "Beauty product",
    },
  }),
  renderer: createReactRenderer(BeautyUpsellComponent),
  locales: blockLocales("BeautyUpsell"),
});
