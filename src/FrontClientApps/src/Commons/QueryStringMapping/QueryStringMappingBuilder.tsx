import { Lens, pathLens, PropertyPicker } from "lens";

import { DateTimeRange } from "Domain/EDI/DataTypes/DateTimeRange";

import {
    BooleanMapper,
    DateTimeRangeMapper,
    DefaultMapper,
    EnumMapper,
    IMapper,
    IntegerMapper,
    SetMapper,
    SetMapperWithNulls,
    StringArrayMapper,
    StringMapper,
    StringSimpleExpression,
    StringSimpleExpressionMapper,
} from "./Mappers";
import { Parser, QueryStringMapping, Stringifier } from "./QueryStringMapping";

export type StringSimpleExpression = StringSimpleExpression;

interface IPropertyConfigurator<T> {
    createParser(): Parser<T>;
    createStringifier(): Stringifier<T>;
}

class PropertyConfigurator<T extends {}, TProperty> implements IPropertyConfigurator<T> {
    public mapper: IMapper<TProperty>;
    public lens: Lens<T, Nullable<TProperty>>;

    public constructor(propertyPicker: PropertyPicker<T, Nullable<TProperty>>, mapper: IMapper<TProperty>) {
        this.lens = pathLens(propertyPicker);
        this.mapper = mapper;
    }

    public createParser(): Parser<T> {
        return (target, parsedQueryString) => this.lens.set(target, this.mapper.parse(parsedQueryString));
    }

    public createStringifier(): Stringifier<T> {
        return (target, parsedQueryString) => this.mapper.stringify(parsedQueryString, this.lens.get(target));
    }
}

export class QueryStringMappingBuilder<T extends {}> {
    public configurators: Array<IPropertyConfigurator<T>> = [];

    public mapTo<TProperty>(
        propertyPicker: PropertyPicker<T, Nullable<TProperty>>,
        mapper: IMapper<TProperty>
    ): QueryStringMappingBuilder<T> {
        const result = new PropertyConfigurator<T, TProperty>(propertyPicker, mapper);
        this.configurators.push(result);
        return this;
    }

    public mapToDefault<TProperty>(
        propertyPicker: PropertyPicker<T, Nullable<TProperty>>,
        defaultValue: Nullable<TProperty>
    ): QueryStringMappingBuilder<T> {
        return this.mapTo(propertyPicker, new DefaultMapper(defaultValue));
    }

    public mapToSetWithNulls<TEnum>(
        propertyPicker: PropertyPicker<T, Nullable<Array<TEnum | null>>>,
        queryStringParameterName: string,
        enumValues: { [key: string]: TEnum },
        allowNegationOperator: boolean = false
    ): QueryStringMappingBuilder<T> {
        return this.mapTo(
            propertyPicker,
            new SetMapperWithNulls<TEnum>(queryStringParameterName, enumValues, allowNegationOperator)
        );
    }

    public mapToSet<TEnum>(
        propertyPicker: PropertyPicker<T, Nullable<TEnum[]>>,
        queryStringParameterName: string,
        enumValues: { [key: string]: TEnum },
        allowNegationOperator: boolean = false
    ): QueryStringMappingBuilder<T> {
        return this.mapTo(propertyPicker, new SetMapper(queryStringParameterName, enumValues, allowNegationOperator));
    }

    public mapToStringArray(
        propertyPicker: PropertyPicker<T, Nullable<string[]>>,
        queryStringParameterName: string,
        defaultValue?: Nullable<string[]>
    ): QueryStringMappingBuilder<T> {
        return this.mapTo(propertyPicker, new StringArrayMapper(queryStringParameterName, defaultValue));
    }

    public mapToEnum<TEnum extends any>(
        propertyPicker: PropertyPicker<T, Nullable<TEnum>>,
        queryStringParameterName: string,
        enumValues: { [key: string]: TEnum }
    ): QueryStringMappingBuilder<T> {
        return this.mapTo(propertyPicker, new EnumMapper(queryStringParameterName, enumValues));
    }

    public mapToDateTimeRange(
        propertyPicker: PropertyPicker<T, Nullable<DateTimeRange>>,
        queryStringParameterName: string,
        defaultValue: Nullable<DateTimeRange> = null
    ): QueryStringMappingBuilder<T> {
        return this.mapTo(propertyPicker, new DateTimeRangeMapper(queryStringParameterName, defaultValue));
    }

    public mapToStringSimpleExpression(
        propertyPicker: PropertyPicker<T, Nullable<StringSimpleExpression>>,
        queryStringParameterName: string
    ): QueryStringMappingBuilder<T> {
        return this.mapTo(propertyPicker, new StringSimpleExpressionMapper(queryStringParameterName));
    }

    public mapToString(
        propertyPicker: PropertyPicker<T, Nullable<string>>,
        queryStringParameterName: string,
        defaultValue?: Nullable<string>
    ): QueryStringMappingBuilder<T> {
        return this.mapTo(propertyPicker, new StringMapper(queryStringParameterName, defaultValue));
    }

    public mapToInteger(
        propertyPicker: PropertyPicker<T, Nullable<number>>,
        queryStringParameterName: string,
        defaultValue?: Nullable<number>
    ): QueryStringMappingBuilder<T> {
        return this.mapTo(propertyPicker, new IntegerMapper(queryStringParameterName, defaultValue));
    }

    public mapToBoolean(
        propertyPicker: PropertyPicker<T, Nullable<boolean>>,
        queryStringParameterName: string,
        defaultValue?: Nullable<boolean>
    ): QueryStringMappingBuilder<T> {
        return this.mapTo(propertyPicker, new BooleanMapper(queryStringParameterName, defaultValue));
    }

    public build(): QueryStringMapping<T> {
        return new QueryStringMapping(
            this.configurators.map(x => x.createParser()),
            this.configurators.map(x => x.createStringifier())
        );
    }
}
