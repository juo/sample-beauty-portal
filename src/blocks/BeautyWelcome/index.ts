import { defineBlock } from "@juo/blocks";
import { createReactRenderer } from "@juo/blocks/react";
import type { FromExtendedSchema, ExtendedJSONSchema } from "json-schema-to-ts";
import { blockLocales } from "../../locales";
import { BeautyWelcome as BeautyWelcomeComponent } from "./BeautyWelcome";

type Extensions = {
  "x-juo-control-type": "inline-text";
};

type BeautySchema = ExtendedJSONSchema<Extensions>;

const schema = {
  type: "object",
  properties: {
    props: {
      type: "object",
      properties: {
        greetingPrefix: {
          type: "string",
          "x-juo-control-type": "inline-text",
          default: "Welcome back,",
        },
        subtitle: {
          type: "string",
          "x-juo-control-type": "inline-text",
          default: "Manage your beauty subscription",
        },
        showSubtitle: {
          type: "boolean",
          title: "Show subtitle",
          default: true,
        },
      },
      required: ["greetingPrefix", "subtitle", "showSubtitle"],
      additionalProperties: false,
    },
  },
  required: ["props"],
  additionalProperties: false,
} as const satisfies BeautySchema;

type Schema = FromExtendedSchema<Extensions, typeof schema>;

export const BeautyWelcome = defineBlock<Schema>("BeautyWelcome", {
  group: "theme",
  schema,
  initialValue: () => ({
    props: {
      greetingPrefix: "Welcome back,",
      subtitle: "Manage your beauty subscription",
      showSubtitle: true,
    },
  }),
  renderer: createReactRenderer(BeautyWelcomeComponent),
  locales: blockLocales("BeautyWelcome"),
});
