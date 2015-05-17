'use strict';

module.exports = {
  CDMA: {
    heading: 'Виділення сигналу зі спільного каналу з шумом',
    introPart: 'Як виділити',
    signalWithNoiseInCommonChannelCaption: 'Граф. 11, Сигнал у спільному каналі з шумом',
    firstSignalCorrelationCapture: 'Граф. 12, Кореляція спільного сигналу з кодом першого сигналу',
    secondSignalCorrelationCapture: 'Граф. 13, Кореляція спільного сигналу з кодом другого сигналу'
  },
  commonChannel: {
    heading: 'Сигнали в спільному каналі',
    introPart: 'Як сигнали потрапляють в спільний канал',
    firstSignalOnCarrierCapture: 'Граф. 6, Перший закодований сигнал нанесениий на несучу',
    secondSignalOnCarrierCapture: 'Граф. 7, Другий закодований сигнал нанесениий на несучу',
    signalInCommonChannelCaption: 'Граф. 8, Сигнал у спільному каналі'

  },
  commonChannelWithNoise: {
    heading: 'Шум в спільному каналі',
    introPart: 'як сигнал співпрацює з шумом',
    signalInCommonChannelCaption: 'Граф. 9, Сигнал у спільному каналі',
    signalWithNoiseInCommonChannelCaption: 'Граф. 10, Сигнал у спільному каналі з шумом'
  },
  sequenceGuessing: {

  },
  signalOnCarrier: {
    heading: 'Сигнал на несучій',
    introPart: 'В даній частині розподідається основний вступ про нанесення закодованоо сигналу на несучу',
    signalWithSequenceCapture: 'Граф. 4, Закодований сигнал',
    aboutCarrying: 'Інформація про змішування з несучою',
    carrierCaption: 'Граф. 5, Несуча, гармонічний сигнал',
    signalOnCarrierCapture: 'Граф. 6, Закодований сигнал нанесениий на несучу'
  },
  signalWithSequence: {
    heading: 'Кодування сигналу',
    introPart: 'В даній частині розподідається основний вступ по пвп та кодуванні сигналів з їх допомогою',
    signalCapture: 'Граф. 1, Бітовий інфромаційний сигнал',
    aboutPRNCode: 'Інформація про ПВШП',
    PRNCapture: 'Граф. 2, Бітова псевдовипадкова послідовність',
    aboutMixingSignalWithPRN: 'Інформація про те як сигнал накладується на пвшп',
    signalWithSequenceCapture: 'Граф. 3, Бітовий інформаційний сигнал нанесений на пвшп'
  },
  commonTexts: {
    mainHeader: 'Кореляційний прийом сигналу',
    nextButton: 'Далі',
    prevButton: 'Назад',
    finishButton: 'Завершити',
    finished: 'Завершено'
  },
  commonErrors: {
    thereIsNoSuchUser: 'Вибачте, в системі не існує такого коричтувача',
    invalidPassword: 'Ви ввели невірний пароль',
    accessDenied: 'Доступ заборонено'
  },
  loginPage: {
    headerText: 'Ваші дані',
    firstName: 'Введіть, будь-ласка, своє ім\'я',
    userName: 'Введіть, будь-ласка, своє прізвище',
    userPassword: 'Введіть, будь-ласка, пароль',
    start: 'Розпочати'
  },
  adminTable: {
    firstName: 'Ім\'я',
    lastName: 'Прізвище',
    isFinished: 'Чи виконано',
    done: 'Виконано',
    inProgress: 'В процессі'
  }
};