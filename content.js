// helper: strip everything from '?' onward
function cleanUrl(url) {
  try {
    let u = new URL(url);
    return u.origin + u.pathname + u.hash;
  } catch {
    return url;
  }
}

function scrubLink(el) {
  if (!el.href) return;
  el.href = cleanUrl(el.href);
}

// scrub all existing links
for (let a of document.querySelectorAll('a[href]')) scrubLink(a);

// observe for future links
new MutationObserver(muts => {
  for (let m of muts) {
    for (let node of m.addedNodes) {
      if (node.nodeType === 1) {
        if (node.matches && node.matches('a[href]')) scrubLink(node);
        node.querySelectorAll && node.querySelectorAll('a[href]').forEach(scrubLink);
      }
    }
  }
}).observe(document.documentElement, { childList: true, subtree: true });

// intercept copy events
document.addEventListener('copy', e => {
  let sel = window.getSelection().toString().trim();
  if (sel.startsWith('http')) {
    e.preventDefault();
    e.clipboardData.setData('text/plain', cleanUrl(sel));
  }
});
