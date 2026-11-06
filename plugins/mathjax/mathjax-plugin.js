// Renders TeX math in the main content (concept card, vocabulary info) with MathJax.
// Delimiters \(…\), $…$, \[…\] and $$…$$; packages for chemistry (mhchem) and upright Greek (upgreek).

const MATHJAX_URL = 'https://cdn.jsdelivr.net/npm/mathjax@4.1.3/tex-chtml.js'
const MATHJAX_INTEGRITY = 'sha384-IgpmJyK7IVIVd18E1Ubslp9a1s6/6VBt9aJFbpzNIJPPMaxwEV7OxR/xY0hHbSck'

// Nodes typeset last; a partial page load removes them before the callback runs.
let mathjaxTypesetNodes = []

function mathjaxTypesetMainContent () {
  const content = document.getElementById('main-content')
  // Before MathJax has loaded, window.MathJax is still the configuration; startup.ready typesets then.
  if (!content || !window.MathJax.typesetPromise) {
    return
  }
  window.MathJax.typesetClear(mathjaxTypesetNodes)
  mathjaxTypesetNodes = Array.from(content.children)
  window.MathJax.typesetPromise(mathjaxTypesetNodes)
}

window.MathJax = {
  loader: { load: ['[tex]/mhchem', '[tex]/upgreek'] },
  tex: {
    packages: { '[+]': ['mhchem', 'upgreek'] },
    inlineMath: { '[+]': [['$', '$']] }
  },
  options: {
    // WORKAROUND: with speech generation on, typesetPromise after a partial page load often never
    // settles (cause unknown, nfdi4cat/goldbook-skos#6); assistive MathML serves screen readers instead.
    menuOptions: { settings: { assistiveMml: true, speech: false, braille: false } }
  },
  startup: {
    typeset: false,
    ready () {
      window.MathJax.startup.defaultReady()
      window.MathJax.startup.promise.then(mathjaxTypesetMainContent)
    }
  }
}

const mathjaxScript = document.createElement('script')
mathjaxScript.src = MATHJAX_URL
mathjaxScript.integrity = MATHJAX_INTEGRITY
mathjaxScript.crossOrigin = 'anonymous'
mathjaxScript.async = true
document.head.appendChild(mathjaxScript)
