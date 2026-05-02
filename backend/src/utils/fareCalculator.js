/**
 * CargoBee Fare Calculator
 * Base fare + ₹15/km after 3km + peak hour surcharge + GST
 */

const VEHICLE_BASE_FARE = {
  mini_tempo:   249,
  pickup_truck: 599,
  e_cart:       249,
};

const PER_KM_RATE       = 15;    // ₹15/km
const FREE_KM           = 3;     // first 3 km included in base
const GST_RATE          = 0.018; // 1.8% GST
const PEAK_SURCHARGE    = 0.20;  // +20% during peak hours

/**
 * Returns true if the given Date falls within peak hours
 * Peak: 08:00–10:00 or 17:00–20:00
 */
const isPeakHour = (date = new Date()) => {
  const h = date.getHours();
  return (h >= 8 && h < 10) || (h >= 17 && h < 20);
};

/**
 * Calculate a detailed fare breakdown
 * @param {string} vehicleType  — 'mini_tempo' | 'pickup_truck' | 'e_cart'
 * @param {number} distanceKm   — route distance in km
 * @param {Date}   [at]         — booking time (default: now)
 * @returns {{ base, distanceCharge, peakSurcharge, gst, total }}
 */
const calculateFare = (vehicleType, distanceKm, at = new Date()) => {
  const base = VEHICLE_BASE_FARE[vehicleType] ?? VEHICLE_BASE_FARE.mini_tempo;

  // Distance charge only for km beyond the free threshold
  const chargeableKm     = Math.max(0, distanceKm - FREE_KM);
  const distanceCharge   = Math.round(chargeableKm * PER_KM_RATE);

  const subtotal         = base + distanceCharge;

  // Peak hour surcharge
  const peakSurcharge    = isPeakHour(at) ? Math.round(subtotal * PEAK_SURCHARGE) : 0;

  const preTax           = subtotal + peakSurcharge;
  const gst              = Math.round(preTax * GST_RATE);
  const total            = preTax + gst;

  return { base, distanceCharge, peakSurcharge, gst, total };
};

module.exports = { calculateFare, isPeakHour, VEHICLE_BASE_FARE };
