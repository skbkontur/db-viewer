import { ValidationInfo } from "@skbkontur/react-ui-validations";

export function validateBusinessObjectField(value: Nullable<string>): ValidationInfo | null {
    const invalidCharacters = "<>*%&:/\\?#";
    for (const e of invalidCharacters) {
        if (value != null && value.includes(e)) {
            return { message: `Некорректный символ: '${e}'`, type: "submit" };
        }
    }
    return null;
}
