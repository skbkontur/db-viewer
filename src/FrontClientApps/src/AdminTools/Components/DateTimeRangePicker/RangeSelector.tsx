import moment, { Moment } from "moment";

import { TimeUtils } from "Commons/TimeUtils";
import { DateTimeRange } from "Domain/EDI/DataTypes/DateTimeRange";
import { TimeZone } from "Domain/EDI/DataTypes/Time";

export function offset(offsetValue: number, date: Date): Date {
    return moment(date)
        .utc()
        .add(offsetValue, "m")
        .toDate();
}

function utc(): Moment {
    return moment.utc();
}

export class RangeSelector {
    public timeZoneOffset: number;

    public constructor(timeZone: Nullable<TimeZone>) {
        this.timeZoneOffset = -TimeUtils.getTimeZoneOffsetOrDefault(timeZone);
    }

    public setBounds(start: Moment, end: Moment = start): DateTimeRange {
        const lower = start
            .hour(0)
            .minute(0)
            .second(0)
            .toDate();
        const upper = end
            .hour(23)
            .minute(59)
            .second(59)
            .toDate();
        return {
            lowerBound: offset(this.timeZoneOffset, lower),
            upperBound: offset(this.timeZoneOffset, upper),
        };
    }

    public getYesterday(): DateTimeRange {
        return this.setBounds(utc().add(-1, "days"));
    }

    public getToday(): DateTimeRange {
        return this.setBounds(utc());
    }

    public getWeek(): DateTimeRange {
        return this.setBounds(utc().subtract(6, "d"), utc());
    }

    public getMonth(): DateTimeRange {
        return this.setBounds(utc().subtract(1, "months"), utc());
    }

    public getMonthOf(date: Date | string): DateTimeRange {
        return this.setBounds(
            moment(date)
                .utc()
                .subtract(1, "months"),
            utc()
        );
    }

    public getYear(): DateTimeRange {
        return this.setBounds(utc().subtract(1, "y"), utc());
    }
}
