import type { LegalDocument } from "../types";
import { SUPPORT_EMAIL } from "./contact";

/**
 * Plain-language summaries shown from the footer. They describe how the marketplace is
 * meant to work; have them reviewed by a Ugandan legal adviser before relying on them.
 */
export const LEGAL_DOCUMENTS: readonly LegalDocument[] = [
  {
    id: "terms",
    title: "Terms of Use",
    summary: "The simple rules that keep E-Buy Uganda fair for buyers and sellers. Last updated 10 October 2026.",
    sections: [
      {
        heading: "What E-Buy is",
        body: [
          "E-Buy Uganda is an online marketplace that connects buyers with independent sellers. Sellers, not E-Buy, own and are responsible for the items they list.",
        ],
      },
      {
        heading: "Your account",
        body: [
          "Provide a real name and a phone number you control. You are responsible for activity on your account. One person, one account.",
        ],
      },
      {
        heading: "Listing and buying",
        body: [
          "Sellers must describe items honestly, including their condition, and may only list items they are allowed to sell. Prohibited items include stolen goods, counterfeit goods, weapons, and anything illegal in Uganda.",
          "Buyers should agree the price with the seller, inspect the item, and only then pay. Prices are shown in Ugandan Shillings (UGX).",
        ],
      },
      {
        heading: "Payments",
        body: [
          "Payments are made between buyer and seller, normally by MTN MoMo or Airtel Money. Never pay in advance to someone you have not met or verified.",
        ],
      },
      {
        heading: "Removal of listings and accounts",
        body: ["We may remove listings or suspend accounts that break these rules or put other users at risk."],
      },
      {
        heading: "Contact",
        body: [`Questions about these terms? Email ${SUPPORT_EMAIL}.`],
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    summary: "What we collect, why, and the choices you have. Last updated 10 October 2026.",
    sections: [
      {
        heading: "What we collect",
        body: [
          "Account details (name, phone number), the listings you post, and basic usage data such as the pages you view. Items you save are stored in your own browser.",
        ],
      },
      {
        heading: "How we use it",
        body: [
          "To run the marketplace, show your listings to buyers, connect buyers and sellers, prevent fraud and improve the service.",
        ],
      },
      {
        heading: "What other users see",
        body: [
          "If you list an item, buyers can see your shop name, general location and the WhatsApp or phone number you provide, so they can contact you.",
        ],
      },
      {
        heading: "Your choices",
        body: [`You can ask us to correct or delete your data at any time by emailing ${SUPPORT_EMAIL}.`],
      },
    ],
  },
  {
    id: "safety",
    title: "Safety Tips",
    summary: "Simple habits that protect you when buying and selling.",
    sections: [
      {
        heading: "Before you meet",
        body: [
          "Chat on WhatsApp first and look for the Verified Seller and Top Rated badges. Ask for extra photos or a short video of the item.",
        ],
      },
      {
        heading: "When you meet",
        body: [
          "Meet in a busy public place during the day and bring a friend if you can. Test the item, check serial numbers and ask for the logbook for vehicles.",
        ],
      },
      {
        heading: "When you pay",
        body: [
          "Pay only after you are satisfied. Be wary of deals that are too good to be true and of anyone who rushes you or asks for a deposit to “reserve” an item.",
        ],
      },
      {
        heading: "Report a problem",
        body: [`If something feels wrong, stop and tell us at ${SUPPORT_EMAIL}.`],
      },
    ],
  },
];
