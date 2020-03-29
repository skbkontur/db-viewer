import { ValidationInfo } from "@skbkontur/react-ui-validations";

export function validateObjectField(value: Nullable<string>): ValidationInfo | null {
    const invalidCharacters = "<>*%&:/\\?#";
    for (const e of invalidCharacters) {
        if (value != null && value.includes(e)) {
            return { message: `Некорректный символ: '${e}'`, type: "submit" };
        }
    }
    return null;
}
