const imageCache = {};

function byId(id) {
  return document.getElementById(id);
}

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

function range(prefix, min, max, suffix = ".png") {
  const result = [];
  for (let i = min; i <= max; i++) result.push(`${prefix}${i}${suffix}`);
  return result;
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function randomBetween(min, max) {
  if (max <= min) return min;
  return min + Math.random() * (max - min);
}
