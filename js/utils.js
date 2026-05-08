const imageCache = {};

/**
 * - Returns a DOM element by its id.
 */
function byId(id) {
  return document.getElementById(id);
}

/**
 * - Loads and caches an image for repeated rendering.
 */
function getImage(path) {
  try {
    if (imageCache[path]) return imageCache[path];
    const image = new Image();
    image.src = path;
    imageCache[path] = image;
    return image;
  } catch (e) {
    console.warn("getImage failed:", path, e);
    return new Image();
  }
}

/**
 * - Builds an array of file paths from a numeric range.
 */
function range(prefix, min, max, suffix = ".png") {
  const result = [];
  for (let i = min; i <= max; i++) result.push(`${prefix}${i}${suffix}`);
  return result;
}

/**
 * - Clamps a number between a minimum and maximum value.
 */
function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

/**
 * - Returns a random number between min and max.
 */
function randomBetween(min, max) {
  if (max <= min) return min;
  return min + Math.random() * (max - min);
}
