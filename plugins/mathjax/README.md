# MathJax plugin

Renders TeX math in literals of the concept and vocabulary pages with [MathJax](https://www.mathjax.org/) 4, loaded from jsDelivr with a pinned version and a Subresource Integrity hash.
It recognises the delimiters `\(…\)`, `$…$`, `\[…\]` and `$$…$$` and loads the TeX packages mhchem (`\ce`, `\pu`) and upgreek (`\uppi`, …).

Enable it per vocabulary in `config.ttl`:

```turtle
:goldbook a skosmos:Vocabulary ;
    skosmos:vocabularyPlugins ("mathjax") .
```

MathJax speech and Braille generation are switched off and assistive MathML is used for screen readers; see the workaround note in `mathjax-plugin.js`.

## Tests

The Cypress spec `tests/cypress/goldbook/mathjax.cy.js` runs against a Skosmos at `http://localhost:9090/` with the Gold Book vocabulary of [goldbook-skos](https://github.com/nfdi4cat/goldbook-skos) loaded and this plugin enabled for it.
It is not part of the default spec pattern:

```shell
npx cypress run --config 'specPattern=tests/cypress/goldbook/**/*.cy.js'
```
