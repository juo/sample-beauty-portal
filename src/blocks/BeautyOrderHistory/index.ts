import { defineBlock } from "@juo/blocks";
import { createReactRenderer } from "@juo/blocks/react";
import type { FromExtendedSchema, ExtendedJSONSchema } from "json-schema-to-ts";
import { blockLocales } from "../../locales";
import { BeautyOrderHistory as BeautyOrderHistoryComponent } from "./BeautyOrderHistory";

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
          default: "Order History",
        },
        emptyMessage: {
          type: "string",
          "x-juo-control-type": "inline-text",
          default: "No past orders yet.",
        },
        showItemCount: {
          type: "boolean",
          title: "Show item count",
          "x-juo-group": "items",
          default: true,
        },
        itemLabelSingular: {
          type: "string",
          "x-juo-control-type": "inline-text",
          title: "Item label (singular)",
          "x-juo-group": "items",
          default: "item",
        },
        itemLabelPlural: {
          type: "string",
          "x-juo-control-type": "inline-text",
          title: "Item label (plural)",
          "x-juo-group": "items",
          default: "items",
        },
        visibleStatuses: {
          type: "array",
          title: "Visible statuses",
          items: {
            enum: ["delivered", "skipped", "scheduled", "processing"] as const,
          },
        },
      },
      required: [
        "title",
        "emptyMessage",
        "showItemCount",
        "itemLabelSingular",
        "itemLabelPlural",
        "visibleStatuses",
      ],
      additionalProperties: false,
    },
  },
  required: ["props"],
  additionalProperties: false,
} as const satisfies BeautySchema;

type Schema = FromExtendedSchema<Extensions, typeof schema>;

export const BeautyOrderHistory = defineBlock<Schema>("BeautyOrderHistory", {
  group: "theme",
  schema,
  initialValue: () => ({
    props: {
      title: "Order History",
      emptyMessage: "No past orders yet.",
      showItemCount: true,
      itemLabelSingular: "item",
      itemLabelPlural: "items",
      visibleStatuses: ["delivered", "skipped", "scheduled", "processing"],
    },
  }),
  renderer: createReactRenderer(BeautyOrderHistoryComponent),
  locales: blockLocales("BeautyOrderHistory"),
});
