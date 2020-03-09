export type RussianDateFormat = string;

export interface DateTimeRange {
    lowerBound: Nullable<Date>;
    upperBound: Nullable<Date>;
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface ICanBeValidated {
    focus: () => void;
}

export type DateTimeRangeChange = (e: React.SyntheticEvent<any>, value: DateTimeRange) => void;
