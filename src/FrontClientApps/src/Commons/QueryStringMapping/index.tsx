import { QueryStringMapping } from "./QueryStringMapping";
import { QueryStringMappingBuilder, StringSimpleExpression } from "./QueryStringMappingBuilder";

export type StringSimpleExpression = StringSimpleExpression;
export { QueryStringMapping };

export function queryStringMapping<T extends {}>(): QueryStringMappingBuilder<T> {
    return new QueryStringMappingBuilder<T>();
}
