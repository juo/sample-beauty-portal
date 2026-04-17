import { defineBlock, createBlockInstance } from "@juo/blocks";
import { createReactRenderer } from "@juo/blocks/react";
import { LoginPage } from "../pages/LoginPage";
import { SubscriptionPage } from "../pages/SubscriptionPage";
import { OrdersPage } from "../pages/OrdersPage";

// ─── Login page ───────────────────────────────────────────────────────────

const loginPageSchema = {
  type: "object",
  properties: {
    props: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    slots: {
      type: "object",
      properties: {
        default: {},
      },
      additionalProperties: false,
    },
  },
  required: ["props", "slots"],
  additionalProperties: false,
} as const;

export const BeautyLoginPage = defineBlock("BeautyLoginPage", {
  group: "page",
  schema: loginPageSchema,
  initialValue: () => ({
    props: {},
    slots: {
      default: [createBlockInstance("Login")],
    },
  }),
  renderer: createReactRenderer(LoginPage),
});

// ─── Subscription page ────────────────────────────────────────────────────

const subscriptionPageSchema = {
  type: "object",
  properties: {
    props: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    slots: {
      type: "object",
      properties: {
        nav: {},
        welcome: {},
        upcoming: {},
        upsell: {},
        promo: {},
      },
      additionalProperties: false,
    },
  },
  required: ["props", "slots"],
  additionalProperties: false,
} as const;

export const BeautySubscriptionPage = defineBlock("BeautySubscriptionPage", {
  group: "page",
  schema: subscriptionPageSchema,
  initialValue: () => ({
    props: {},
    slots: {
      nav: [createBlockInstance("BeautyNavigation")],
      welcome: [createBlockInstance("BeautyWelcome")],
      upcoming: [createBlockInstance("BeautyUpcomingOrder")],
      upsell: [createBlockInstance("BeautyUpsell")],
      promo: [createBlockInstance("BeautyPromo")],
    },
  }),
  renderer: createReactRenderer(SubscriptionPage),
});

// ─── Orders page ──────────────────────────────────────────────────────────

const ordersPageSchema = {
  type: "object",
  properties: {
    props: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    slots: {
      type: "object",
      properties: {
        nav: {},
        history: {},
      },
      additionalProperties: false,
    },
  },
  required: ["props", "slots"],
  additionalProperties: false,
} as const;

export const BeautyOrdersPage = defineBlock("BeautyOrdersPage", {
  group: "page",
  schema: ordersPageSchema,
  initialValue: () => ({
    props: {},
    slots: {
      nav: [createBlockInstance("BeautyNavigation")],
      history: [createBlockInstance("BeautyOrderHistory")],
    },
  }),
  renderer: createReactRenderer(OrdersPage),
});
