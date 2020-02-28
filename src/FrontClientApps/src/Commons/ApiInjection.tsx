import PropTypes from "prop-types";
import * as React from "react";

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type WithApiWrapper<TApiProps> = <P extends TApiProps>(
    Comp: React.ComponentType<P>
) => React.ComponentType<Omit<P, keyof TApiProps>>;

export function createWithApiWrapper<TApiProps>(apiNames: Array<keyof TApiProps>): WithApiWrapper<TApiProps> {
    const result: any = function WrapperClassFactory(Comp: React.ComponentType) {
        return class WrapperClass extends React.Component<TApiProps> {
            public static displayName = `withApi(${Comp.displayName})`;
            public static contextTypes = apiNames.map(x => ({ [x]: PropTypes.object })).reduce(merge);
            public context: { [k in typeof apiNames[number]]: {} };

            public constructor(props: TApiProps, context: { [k in typeof apiNames[number]]: {} }) {
                super(props, context);

                for (const key of apiNames) {
                    if (!context[key]) {
                        throw Error(
                            `No api was found in context for Consumer of type ${key}. Wrap your component with ApiProvider`
                        );
                    }
                }
            }

            public render(): JSX.Element {
                const types = apiNames.map(x => ({ [x]: this.context[x] })).reduce(merge);
                return <Comp {...types} {...this.props} />;
            }
        };
    };
    return result;
}

function merge(x: any, y: any): any {
    return { ...x, ...y };
}

type ApiProviderBase<TApiProps> = React.ComponentType<TApiProps & { children?: React.ReactNode }>;

export function createApiProvider<TProps>(propsToContextNames: Array<keyof TProps>): ApiProviderBase<TProps> {
    return class ApiProvider extends React.Component<TProps & { children?: any }> {
        public static childContextTypes = propsToContextNames.map(x => ({ [x]: PropTypes.object })).reduce(merge);

        public getChildContext(): Extract<TProps, { children?: any }> {
            const { children, ...restProps } = this.props as any;
            return restProps;
        }

        public render(): JSX.Element {
            const { children } = this.props;
            return children;
        }
    };
}
