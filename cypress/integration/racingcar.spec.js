describe('구현 결과가 요구사항과 일치해야 한다.', () => {
  const baseUrl = "../../index.html";
  const SELECTOR = {
    CAR_NAME_INPUT: "#car-name-input",
    CAR_NAME_BUTTON: '#car-name-button',
    RACE_COUNT_INPUT: '#race-count-input',
    RACE_COUNT_BUTTON: '#race-count-button',
    RESULT_TEXT: '.result-text',
    RESTART_BUTTON: '.restart-button',
  };

  before(() => {
    Cypress.Commands.add('normalWorking', (carNames, racingCount) => {
      cy.get(SELECTOR.CAR_NAME_INPUT).type(carNames);
      cy.get(SELECTOR.CAR_NAME_BUTTON).click();
  
      cy.get(SELECTOR.RACE_COUNT_INPUT).type(racingCount);
      cy.get(SELECTOR.RACE_COUNT_BUTTON).click();
    });

    Cypress.Commands.add('showCarNameAlert', (invalidInput) => {
      const alertStub = cy.stub();
      cy.on("window:alert", alertStub);
    
      cy.get(SELECTOR.CAR_NAME_INPUT).type(invalidInput);
    
      cy.get(SELECTOR.CAR_NAME_BUTTON)
        .click()
        .then(() => {
          expect(alertStub).to.be.called;
      });
    });

    Cypress.Commands.add('showRaceCountAlert', (carNameInput, invalidInput) => {
      const alertStub = cy.stub();
      cy.get(SELECTOR.CAR_NAME_INPUT).type(carNameInput);
      cy.get(SELECTOR.CAR_NAME_BUTTON).click();

      cy.on("window:alert", alertStub);

      cy.get(SELECTOR.RACE_COUNT_INPUT).type(invalidInput);

      cy.get(SELECTOR.RACE_COUNT_BUTTON)
        .click()
        .then(() => {
          expect(alertStub).to.be.called;
      });
    });

  });

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  /* 우승자 확인 */
  it("게임을 완료하고 우승자를 확인할 수 있어야 한다.", () => {
    
    cy.normalWorking("tt,sally", 1);
    cy.get('.result-text').should((result) => {
      const text = result.text();
      expect(text).to.include('최종 우승자')
    });
  });

  /* 차 이름 */
  it("5글자 초과 자동차 이름을 입력한 경우 alert이 호출되어야 한다.", () => {
    cy.showCarNameAlert("abcdef");
  });

  it("5개 초과하여 자동차를 입력한 경우 alert이 호출되어야 한다.", () => {
    cy.showCarNameAlert("a,  b, c,d,e,f");
  });

  /* 시도 횟수 */
  it("1이상 20이하의 자연수가 아닌 경우 alert이 호출되어야 한다.", () => {
    cy.showRaceCountAlert('1,2,3,4,5', "-2");
  });

  it("숫자가 아닌 경우 alert이 호출되어야 한다.", () => {
    cy.showRaceCountAlert('1,2,3,4,5','aae');
  });

  /* 다시 시작 */
  it("다시 시작하기 버튼을 눌렀을 때에 race-count-input-container 요소가 display none이어야 한다", () => {
    cy.normalWorking("tt,sally", 1);

    cy.get('.restart-button').click();

    cy.get('.race-count-input-container').should('not.have.css', 'display', 'flex');
  });
});
