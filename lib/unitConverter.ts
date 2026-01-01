import type { UnitType } from './constants';

/**
 * Convert a value from the specified unit to pixels
 * @param value - The numeric value to convert
 * @param unit - The unit type (pt, px, em, rem, cm, mm, in)
 * @param conversionDpi - DPI reference for point-based conversions (pt, cm, mm, in)
 * @param baseEmSize - Base font size in pixels for em/rem conversions (default: 16)
 * @returns The value converted to pixels
 */
export function convertToPixels(
  value: number,
  unit: UnitType,
  conversionDpi: number,
  baseEmSize: number = 16
): number {
  switch (unit) {
    case 'pt':
      // 1 pt = 1/72 inch, so pixels = value * (conversionDpi / 72)
      return value * (conversionDpi / 72);
    case 'px':
      // No conversion needed
      return value;
    case 'em':
    case 'rem':
      // Both em and rem use the base font size
      return value * baseEmSize;
    case 'cm':
      // 1 cm = 1/2.54 inch, so pixels = value * (conversionDpi / 2.54)
      return value * (conversionDpi / 2.54);
    case 'mm':
      // 1 mm = 1/25.4 inch, so pixels = value * (conversionDpi / 25.4)
      return value * (conversionDpi / 25.4);
    case 'in':
      // 1 inch = conversionDpi pixels
      return value * conversionDpi;
    default:
      // Fallback to pixels if unit is unknown
      return value;
  }
}

/**
 * Convert a value from pixels to the specified unit
 * @param value - The pixel value to convert
 * @param unit - The target unit type (pt, px, em, rem, cm, mm, in)
 * @param conversionDpi - DPI reference for point-based conversions (pt, cm, mm, in)
 * @param baseEmSize - Base font size in pixels for em/rem conversions (default: 16)
 * @returns The value converted to the target unit
 */
export function convertFromPixels(
  value: number,
  unit: UnitType,
  conversionDpi: number,
  baseEmSize: number = 16
): number {
  switch (unit) {
    case 'pt':
      // Reverse: pixels / (conversionDpi / 72) = pixels * (72 / conversionDpi)
      return value * (72 / conversionDpi);
    case 'px':
      // No conversion needed
      return value;
    case 'em':
    case 'rem':
      // Reverse: pixels / baseEmSize
      return value / baseEmSize;
    case 'cm':
      // Reverse: pixels / (conversionDpi / 2.54) = pixels * (2.54 / conversionDpi)
      return value * (2.54 / conversionDpi);
    case 'mm':
      // Reverse: pixels / (conversionDpi / 25.4) = pixels * (25.4 / conversionDpi)
      return value * (25.4 / conversionDpi);
    case 'in':
      // Reverse: pixels / conversionDpi
      return value / conversionDpi;
    default:
      // Fallback to pixels if unit is unknown
      return value;
  }
}
