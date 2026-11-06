// Runs against a Skosmos instance with the Gold Book vocabulary loaded (goldbook-skos, 1000-term import).
const conceptPage = (id) => '/goldbook/en/page/?uri=' + encodeURIComponent('https://w3id.org/goldbook/' + id)

const definition = () => cy.get('#main-content .prop-skos_definition')

describe('MathJax plugin on Gold Book concept pages', () => {
  const cases = [
    ['inline \\(…\\)', '00035', 'absorptance'],
    ['inline $…$ with mhchem, upgreek and \\mbox', '00126', 'acyloins'],
    ['\\unicode and \\pu', '00012', "'A' value"],
    ['\\bond inside \\ce', '00227', 'alkylenes'],
  ]

  cases.forEach(([what, id, label]) => {
    it('renders ' + what + ' in the definition of ' + label, () => {
      cy.visit(conceptPage(id))
      definition().find('mjx-container').should('exist')
      definition().find('mjx-merror').should('not.exist')
      definition().find('.literal').invoke('text').should('not.match', /\\\(|\$/)
    })
  })

  it('provides MathML for screen readers', () => {
    cy.visit(conceptPage('00035'))
    definition().find('mjx-container mjx-assistive-mml math').should('exist')
  })

  it('renders display math \\[…\\]', () => {
    cy.visit(conceptPage('00086'))
    definition().find('mjx-container[display="true"]').should('exist')
    definition().find('mjx-merror').should('not.exist')
  })

  it('renders math after a partial page load', () => {
    cy.visit(conceptPage('00035'))
    definition().find('mjx-container').should('exist')
    cy.get('#alphabetical').click()
    cy.get('#tab-alphabetical').contains('a', 'absorption pathlength').click()
    cy.get('#concept-heading h2').should('have.text', 'absorption pathlength')
    definition().find('mjx-container').should('exist')
    definition().find('.literal').invoke('text').should('not.contain', '\\(')
  })
})
