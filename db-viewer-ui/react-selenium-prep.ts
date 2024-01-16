import type { ReactSeleniumTestingType } from "@skbkontur/react-selenium-testing";

window.global ||= window;

const customization: ReactSeleniumTestingType = {
    attributeWhiteList: {
        error: [/.*/],
        warning: [/.*/],
        disabled: [/.*/],
        "data-page-number": [/.*/],
        disablePortal: ["ComboBoxRenderer"],
        checked: [/.*/],
        items: ["RadioGroup"],
        value: [/Input|Textarea|RadioGroup|FilteredInput/],
        activePage: ["Paging"],
        pagesCount: ["Paging"],
        trigger: [/Tooltip|ValidationTooltip|ValidationWrapper|ValidationWrapperV1/],
        active: [/.*/],
        className: [/.*/],
        "data-active": [/.*/],
    },
    acceptAttribute: (prevAcceptResult, componentName, propName) => {
        if (componentName === "Select" && propName === "items") {
            return true;
        }
        return prevAcceptResult;
    },
};

(window as any).ReactSeleniumTesting = customization;