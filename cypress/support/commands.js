// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add(`restoreSession`, function ({cookies, lsd, ssd}) {
	const wList = [];
	cy.clearCookies();
	cookies.forEach(cookie => {
		wList.push(cookie.name);
		cy.setCookie(cookie.name, cookie.value, {
			log: true,
			domain: cookie.domain,
			path: cookie.path,
			expiry: cookie.expires,
			httpOnly: cookie.httpOnly,
			secure: cookie.secure
		});
	});

	Cypress.Cookies.defaults({
		preserve: wList
	});

	cy.window().then(window => {
		Object.keys(ssd).forEach(key => window.sessionStorage.setItem(key, ssd[key]));
		Object.keys(lsd).forEach(key => window.localStorage.setItem(key, lsd[key]));
	});
});
