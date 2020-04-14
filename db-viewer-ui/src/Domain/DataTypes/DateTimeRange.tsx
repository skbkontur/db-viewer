export type RussianDateFormat = string;

export interface DateTimeRange {
    lowerBound: Nullable<Date>;
    upperBound: Nullable<Date>;
}

export interface ICanBeValidated {
    focus: () => void;
}
