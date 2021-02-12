describe(`login scenario using task`, () => {
    before(() => {
        cy.task(`getSession`, {username: `****`, password: `****`, url: `****`}).then(session => {
            cy.restoreSession(session);
        })
    })
    it(`login test`, () => {
        cy.visit(`/`);
    })
});