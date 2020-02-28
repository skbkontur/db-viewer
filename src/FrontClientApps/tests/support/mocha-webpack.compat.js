const { JSDOM } = require("jsdom");

const doc = new JSDOM("<!doctype html><html><body></body></html>");
const win = doc.window;
win.Date = Date;

global.document = win.document;
global.window = win;

//TODO: убрать это отсюда
global.currentUserEmail = "kbanaru@skbkontur.ru";
global.partyType = 2;

global.navigator = window.navigator;

function HTMLElement() {}
global.HTMLElement = HTMLElement;

global.__TEST__ = true;
