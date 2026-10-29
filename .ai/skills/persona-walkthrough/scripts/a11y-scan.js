// Accessibility scan for the current page. Run with:
//   playwright-cli -s=<session> run-code --filename=<SKILL_DIR>/scripts/a11y-scan.js
// Reports text contrast, text size, target size, and missing names/labels/alt.
// Heuristic: backgrounds come from ancestor colors only, so text over images
// or gradients is reported as "unknown" and must be checked on a screenshot.
async page => page.evaluate(() => {
  const ctx = Object.assign(document.createElement('canvas'), { width: 1, height: 1 })
    .getContext('2d', { willReadFrequently: true });
  // Canvas normalizes any CSS color (rgb, hsl, oklch, color()) to sRGB bytes.
  const rgba = (css) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = '#000';
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return [r, g, b, a / 255];
  };
  const blend = (top, bottom) => {
    const a = top[3];
    return [0, 1, 2].map(i => top[i] * a + bottom[i] * (1 - a)).concat(1);
  };
  const lum = ([r, g, b]) => {
    const c = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const ratio = (a, b) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };
  // Effective background: stack ancestor background colors until opaque.
  const background = (el) => {
    const layers = [];
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const s = getComputedStyle(n);
      if (s.backgroundImage !== 'none') return null;
      const c = rgba(s.backgroundColor);
      if (c[3] > 0) layers.push(c);
      if (c[3] >= 1) break;
    }
    return layers.reduceRight((acc, c) => blend(c, acc), [255, 255, 255, 1]);
  };
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && Number(s.opacity) > 0;
  };
  const describe = (el) => {
    const text = (el.innerText || el.getAttribute('aria-label') || el.getAttribute('alt') || '').trim().replace(/\s+/g, ' ');
    return `<${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}> "${text.slice(0, 50)}"`;
  };

  const contrastFails = [], contrastUnknown = [], smallText = [];
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let t = walker.nextNode(); t; t = walker.nextNode()) {
    const el = t.parentElement;
    if (!el || seen.has(el) || !t.textContent.trim() || !visible(el)) continue;
    if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) continue;
    seen.add(el);
    const s = getComputedStyle(el);
    const size = parseFloat(s.fontSize);
    const bold = parseInt(s.fontWeight, 10) >= 700;
    const large = size >= 24 || (bold && size >= 18.66);
    const required = large ? 3 : 4.5;
    if (size < 12) smallText.push({ el: describe(el), fontSize: `${size}px` });
    const bg = background(el);
    if (!bg) { contrastUnknown.push(describe(el)); continue; }
    const fg = blend(rgba(s.color), bg);
    const r = ratio(fg, bg);
    if (r < required) {
      contrastFails.push({ el: describe(el), ratio: r.toFixed(2), required, fontSize: `${size}px`, color: s.color, background: `rgb(${bg.slice(0, 3).map(Math.round).join(', ')})` });
    }
  }

  const interactive = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, [role=button], [role=link], [tabindex]:not([tabindex="-1"])')].filter(visible);
  const smallTargets = interactive
    .filter(el => !(el.tagName === 'A' && getComputedStyle(el).display === 'inline'))
    .map(el => [el, el.getBoundingClientRect()])
    .filter(([, r]) => r.width < 24 || r.height < 24)
    .map(([el, r]) => ({ el: describe(el), size: `${Math.round(r.width)}x${Math.round(r.height)}` }));
  const unnamed = interactive
    .filter(el => !['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName))
    .filter(el => !(el.innerText || '').trim() && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby') && !el.getAttribute('title') && !el.querySelector('img[alt]:not([alt=""])'))
    .map(describe);
  const unlabeledInputs = [...document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]), select, textarea')]
    .filter(visible)
    .filter(el => !(el.labels && el.labels.length) && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby'))
    .map(el => `<${el.tagName.toLowerCase()} type=${el.type} name=${el.name || '-'} placeholder="${el.placeholder || ''}">`);
  const missingAlt = [...document.images].filter(visible).filter(img => !img.hasAttribute('alt')).map(img => img.currentSrc || img.src);

  const cap = (list) => ({ count: list.length, items: list.slice(0, 15) });
  return {
    url: location.href,
    lang: document.documentElement.lang || '(missing)',
    bodyFontSize: getComputedStyle(document.body).fontSize,
    contrastFails: cap(contrastFails),
    contrastUnknown: cap(contrastUnknown),
    smallText: cap(smallText),
    smallTargets: cap(smallTargets),
    unnamedControls: cap(unnamed),
    unlabeledInputs: cap(unlabeledInputs),
    imagesMissingAlt: cap(missingAlt),
    horizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
  };
})
