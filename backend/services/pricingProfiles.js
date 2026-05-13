/**
 * Pricing Profiles for different project types
 * Weights must sum to 1.0 (100%)
 */
const pricingProfiles = {
  staticWebsite: [
    { name: "static Website Development", weight: 0.33 },
    { name: "DOMAIN", weight: 0.04 },
    { name: "SERVER", weight: 0.11 },
    { name: "SSL CERTIFICATE", weight: 0.06 },
    { name: "WHATSAPP INTIGRATION", weight: 0.07 },
    { name: "UI/UX Design (Upto 5 Pages)", weight: 0.14 },
    { name: "SEO Setup", weight: 0.07 },
    { name: "SPEED AND OPTIMIZATION", weight: 0.07 },
    { name: "CONTACT FORM WITH MAIL INTEGRATION", weight: 0.11 }
  ],
  ecommerce: [
    { name: "static Website Development", weight: 0.40 }, // High dev for products/cart
    { name: "DOMAIN", weight: 0.03 },
    { name: "SERVER", weight: 0.12 },
    { name: "SSL CERTIFICATE", weight: 0.05 },
    { name: "WHATSAPP INTIGRATION", weight: 0.05 },
    { name: "UI/UX Design (Upto 5 Pages)", weight: 0.15 },
    { name: "SEO Setup", weight: 0.05 },
    { name: "SPEED AND OPTIMIZATION", weight: 0.05 },
    { name: "CONTACT FORM WITH MAIL INTEGRATION", weight: 0.05 }
  ],
  erp: [
    { name: "static Website Development", weight: 0.50 }, // Heavy logic
    { name: "DOMAIN", weight: 0.02 },
    { name: "SERVER", weight: 0.15 }, // High infra
    { name: "SSL CERTIFICATE", weight: 0.03 },
    { name: "WHATSAPP INTIGRATION", weight: 0.05 },
    { name: "UI/UX Design (Upto 5 Pages)", weight: 0.10 },
    { name: "SEO Setup", weight: 0.05 },
    { name: "SPEED AND OPTIMIZATION", weight: 0.05 },
    { name: "CONTACT FORM WITH MAIL INTEGRATION", weight: 0.05 }
  ],
  saas: [
    { name: "static Website Development", weight: 0.45 },
    { name: "DOMAIN", weight: 0.02 },
    { name: "SERVER", weight: 0.13 },
    { name: "SSL CERTIFICATE", weight: 0.04 },
    { name: "WHATSAPP INTIGRATION: 5%", weight: 0.06 },
    { name: "UI/UX Design (Upto 5 Pages)", weight: 0.15 },
    { name: "SEO Setup", weight: 0.05 },
    { name: "SPEED AND OPTIMIZATION", weight: 0.05 },
    { name: "CONTACT FORM WITH MAIL INTEGRATION", weight: 0.05 }
  ]
};

module.exports = pricingProfiles;
