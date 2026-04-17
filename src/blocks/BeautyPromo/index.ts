import { defineBlock } from "@juo/blocks";
import { createReactRenderer } from "@juo/blocks/react";
import type { FromExtendedSchema, ExtendedJSONSchema } from "json-schema-to-ts";
import { blockLocales } from "../../locales";
import { BeautyPromo as BeautyPromoComponent } from "./BeautyPromo";

type Extensions = {
  "x-juo-control-type": "inline-text";
  "x-juo-group": string;
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
          default: "Special Offer",
        },
        description: {
          type: "string",
          "x-juo-control-type": "inline-text",
          default: "Apply your exclusive discount code",
        },
        discountCode: {
          type: "string",
          "x-juo-control-type": "inline-text",
          default: "BEAUTY20",
        },
        ctaText: {
          type: "string",
          "x-juo-control-type": "inline-text",
          default: "Apply code",
        },
        appliedText: {
          type: "string",
          "x-juo-control-type": "inline-text",
          default: "Applied!",
        },
        icon: {
          type: "string",
          "x-juo-control-type": "inline-text",
          default: "✨",
        },
        preset: {
          type: "string",
          enum: ["imageTop", "imageLeft", "noImage"],
          title: "Layout preset",
          default: "imageTop",
        },
        imageUrl: {
          type: "string",
          title: "Image URL",
          "x-juo-group": "media",
          default:
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
        },
        imageAlt: {
          type: "string",
          title: "Image alt text",
          "x-juo-group": "media",
          default: "Promo",
        },
      },
      required: [
        "title",
        "description",
        "discountCode",
        "ctaText",
        "appliedText",
        "icon",
        "preset",
        "imageUrl",
        "imageAlt",
      ],
      additionalProperties: false,
    },
  },
  required: ["props"],
  additionalProperties: false,
} as const satisfies BeautySchema;

type Schema = FromExtendedSchema<Extensions, typeof schema>;

export const BeautyPromo = defineBlock<Schema>("BeautyPromo", {
  group: "theme",
  schema,
  initialValue: () => ({
    props: {
      title: "Special Offer",
      description: "Apply your exclusive discount code",
      discountCode: "BEAUTY20",
      ctaText: "Apply code",
      appliedText: "Applied!",
      icon: "✨",
      preset: "imageTop",
      imageUrl:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "Promo",
    },
  }),
  renderer: createReactRenderer(BeautyPromoComponent),
  locales: blockLocales("BeautyPromo"),
});
