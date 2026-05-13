const pricingProfiles = require('./pricingProfiles');

/**
 * Professional Pricing Engine
 * Calculates deterministic pricing based on weights and ensures total matching.
 */
class PricingEngine {
  static calculate(totalPrice, profileKey = 'staticWebsite') {
    const profile = pricingProfiles[profileKey] || pricingProfiles.staticWebsite;
    const rawPrice = parseFloat(totalPrice) || 0;

    if (rawPrice <= 0) return [];

    // 1. Initial calculation based on weights
    let items = profile.map(item => ({
      service: item.name,
      price: Math.round(rawPrice * item.weight)
    }));

    // 2. Ensure mathematical total matching (Correct rounding errors)
    const currentTotal = items.reduce((sum, item) => sum + item.price, 0);
    const difference = rawPrice - currentTotal;

    if (difference !== 0) {
      // Adjust the largest item (usually development) to absorb rounding differences
      items[0].price += difference;
    }

    return items;
  }

  static getFormattedString(items) {
    return items.map(item => `${item.service} | ₹${item.price}`).join('\n');
  }
}

module.exports = PricingEngine;
