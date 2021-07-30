// Some good settings for applying paddingX on a 100vw div depending on screen width
export const SPACING_X_REACTIVE_VALUES = ["1em", null, 75, 130, 200];

// Utility function for overriding a styles object
export const overrideStyles = (original: any, override: any) => {
  return Object.assign({}, original, override);
};
