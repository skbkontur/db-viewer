import originalNumeral from "numeral";

originalNumeral.register("locale", "ru", {
    delimiters: {
        thousands: " ",
        decimal: ".",
    },
    abbreviations: {
        thousand: "k",
        million: "m",
        billion: "b",
        trillion: "t",
    },
    currency: {
        symbol: "₽",
    },
    ordinal: (_number: number): string => "",
});
originalNumeral.locale("ru");

export const numeral = originalNumeral;
