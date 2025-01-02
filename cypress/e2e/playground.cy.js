describe('Cypress PlayGround',()=>{
    beforeEach('Visitando Pagina',()=>{
      //  const now = new Date(Date.UTC(2024 , 25 , 12))
      //  cy.clock(now)
        cy.visit('https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html')

    })

    it('Testando o Banner oficial',()=>{
        cy.contains('📣 Get to know the '+'Cypress, from Zero to the Cloud').should('be.visible')
    })

    it('Testando visualização do Banner',()=>{
        cy.get('#promotional-banner').should('be.visible')
    })

    it('Clica no botão subscribe',()=>{
        cy.contains('button','Subscribe').click()
        cy.contains('#success',"You've been successfully subscribed to our newsletter.")
        .should('be.visible')
    })

    it('Digita em campos',()=>{
        cy.get('#signature-textarea').type('Saulo Vilela Barbosa')
        cy.contains('#signature','Saulo Vilela Barbosa').should('be.visible')
    })

    it('Digita nome e clica no checkBox',()=>{
        cy.get('#signature-textarea-with-checkbox').type('Saulo Vilela Barbosa')
        cy.get('#signature-checkbox').check()
        cy.contains('#signature-triggered-by-check','Saulo Vilela Barbosa').should('be.visible')
        cy.get('#signature-checkbox').uncheck()
        cy.contains('#signature-triggered-by-check','Saulo Vilela Barbosa').should('not.exist')
    })

    it('Clica em Radio Button ON e OFF',()=>{
        cy.get('#on').check()
        cy.contains('#on-off','ON').should('be.visible')
        cy.contains('#on-off','OFF').should('not.exist')
        cy.get('#off').check()
        cy.contains('#on-off','OFF').should('be.visible')
        cy.contains('#on-off','ON').should('not.exist')
    })

    it('Seleciona campo select Basic',()=>{
        cy.contains('p',"ou haven't selected a type yet.").should('be.visible')
        cy.get('#selection-type').select('Basic')
        cy.contains('#select-selection',"You've selected: "+'BASIC').should('be.visible')
    })

    it('Seleciona campo select Standard',()=>{
        cy.contains('p',"ou haven't selected a type yet.").should('be.visible')
        cy.get('#selection-type').select('Standard')
        cy.contains('#select-selection',"You've selected: "+'STANDARD').should('be.visible')
    })

    it('Seleciona campo select Vip',()=>{
        cy.contains('p',"ou haven't selected a type yet.").should('be.visible')
        cy.get('#selection-type').select('VIP')
        cy.contains('#select-selection',"You've selected: "+'VIP').should('be.visible')
    })

    it('Tipo de seleção multipla em campo select',()=>{
        cy.contains('p',"You haven't selected any fruit yet.").should('be.visible')
        cy.get('#fruit[multiple]').select(['apple','banana','date'])
        cy.contains("You've selected the following fruits: "+ 'apple, banana, date').should('be.visible')
    })

    it('upload de arquivos',()=>{
        cy.contains('#try-it-out','Try it out by creating a test that selects a file and make sure the correct file name is displayed.').should('be.visible')
        cy.get('#file-upload').selectFile('./cypress/fixtures/example.json')
        cy.contains('#file','The following file has been selected for upload: '+'example.json').should('be.visible')
    })

    it('Clica no botão para disparar uma requisição',()=>{
        cy.intercept('GET','https://jsonplaceholder.typicode.com/todos/1')
        .as('getTodo')

        cy.contains('button','Get TODO').click()
        cy.wait('@getTodo')
        .its('response.statusCode')
        .should('be.equal',200)

        cy.contains('li','TODO ID: 1').should('be.visible')
        cy.contains('li','Title:').should('be.visible')
        cy.contains('li','Completed: false').should('be.visible')
        cy.contains('li','User ID: 1').should('be.visible')
    })

    it('Clica no botão',()=>{
        const todo = require('../fixtures/todo.json')

        cy.intercept(
            'GET',
            'https://jsonplaceholder.typicode.com/todos/1',
            { fixture: 'todo' }
        ).as('getTodo')

        cy.contains('button', 'Get TODO').click()

        cy.wait('@getTodo')
        .its('response.statusCode')
        .should('be.equal',200)

        cy.contains('li',`TODO ID: ${todo.id}`).should('be.visible')
        cy.contains('li',`Title: ${todo.title}`).should('be.visible')
        cy.contains('li',`Completed: ${todo.completed}`).should('be.visible')
        cy.contains('li',`User ID: ${todo.userId}`).should('be.visible')
    })

    it('Clica no botão e simula falha na API',()=>{
        cy.intercept(
            'GET',
            'https://jsonplaceholder.typicode.com/todos/1',
            {statusCode:500}
        ).as('serverFailure')

        cy.contains('button', 'Get TODO').click()

        cy.wait('@serverFailure')
        .its('response.statusCode')
        .should('be.equal',500)

        cy.contains('span','Oops, something went wrong. Refresh the page and try again.').should('be.visible')
    })

    it('Teste com simulação de que a conexão não funciona',()=>{
        cy.intercept(
            'GET',
            'https://jsonplaceholder.typicode.com/todos/1',
            { forceNetworkError: true}
        ).as('networkError')
        cy.contains('button','Get TODO').click()
        cy.wait('@networkError')
        cy.contains('span','Oops, something went wrong. Check your internet connection, refresh the page, and try again.').should('be.visible')
    })

    it('Testando Cy.Request',()=>{
        cy.request('GET','https://jsonplaceholder.typicode.com/todos/1')
        .its('status')
        .should('be.equal',200)
    })

    Cypress._.times(10,index =>{
        it(`selects ${index + 1} out of 10`,()=>{
            cy.get('#level').invoke('val', index + 1).trigger('change')
            cy.contains('p',`You're on level: ${index + 1}`).should('be.visible')
        })
    })

    it('Interage com campo de data',()=>{
        cy.get('#date').type('2025-01-01').blur()
        cy.contains('p',`The date you've selected is: 2025-01-01`).should('be.visible')
    })

    it('Digita a senha com uma variavel protegida',()=>{
        
        cy.get('#password').type(Cypress.env('password'), {log:false} )
        cy.get('#show-password-checkbox').check()
        cy.get('#show-password-checkbox').should('be.checked')
        cy.get('#password').should('be.visible').and('have.value',Cypress.env('password'))
    })

    it('Contagem de itens da lista',()=>{
        cy.get('ul#animals li').should('have.length',5)
    })

    it('Congelando relógio do navegador',()=>{
        const now = new Date(Date.UTC(2024 , 25 , 12))
        cy.clock(now)
        cy.visit('https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html')
        cy.contains('p','Current date: 2026-02-12')
    })

    it('Usando dados gerados pela aplicação',()=>{
        cy.get('#timestamp')
        .then(element =>{
            const code = element[0].innerText
        cy.get('#code').type(code)
        cy.contains('button', 'Submit').click()
        cy.contains("Congrats! You've entered the correct code.").should('be.visible')
        })
    })

    it('Usando dados incorretos para a aplicação',()=>{
        cy.get('#code').type(1232312312)
        cy.contains('button', 'Submit').click()
        cy.contains("The provided code isn't correct. Please, try again").should('be.visible')
    })

    it('Testando leitura de arquivo',()=>{
        cy.contains('a','Download a text file').click()
        cy.readFile('cypress/downloads/example.txt').should('be.equal','Hello, World!')
    })
    

    

})
