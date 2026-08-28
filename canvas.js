/*
 * Dongtube Assets — Canvas Wrapper
 * Unified API: createCanvas, loadImage, registerFont, GlobalFonts
 * Backward-compatible with @napi-rs/canvas, canvas, and skia-canvas
 */
const path = require('path');

let _canvas, _skia;

try { _canvas = require('canvas'); } catch {}
try { _skia = require('skia-canvas'); } catch {}

const primary = _canvas || _skia;
if (!primary) throw new Error('@hanzywaifu/assets: no canvas module found (install canvas or skia-canvas)');

const createCanvas = primary.createCanvas || ((w, h) => new primary.Canvas(w, h));
const loadImage = primary.loadImage;

const _registeredFonts = new Map();

function registerFont(fontPath, opts) {
  const family = (opts && opts.family) || path.basename(fontPath, path.extname(fontPath));
  if (_registeredFonts.has(family)) return;
  _registeredFonts.set(family, fontPath);
  if (_canvas && _canvas.registerFont) {
    _canvas.registerFont(fontPath, { family });
  } else if (_skia && _skia.FontLibrary && _skia.FontLibrary.registerFont) {
    _skia.FontLibrary.registerFont(fontPath, { family });
  }
}

const GlobalFonts = {
  registerFromPath(fontPath, family) {
    registerFont(fontPath, { family });
  },
  families() {
    return [..._registeredFonts.keys()];
  },
  has(fontFamily) {
    return _registeredFonts.has(fontFamily);
  },
};

const MIME_NORMALIZE = {
  'png': 'image/png',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'webp': 'image/webp',
  'raw': 'application/octet-stream',
};

function getCanvasBuffer(canvas, mime) {
  const m = MIME_NORMALIZE[mime] || mime || 'image/png';
  if (typeof canvas.encode === 'function') {
    return canvas.encode(m);
  }
  return canvas.toBuffer(m);
}

module.exports = {
  createCanvas,
  loadImage,
  registerFont,
  GlobalFonts,
  getCanvasBuffer,
};
