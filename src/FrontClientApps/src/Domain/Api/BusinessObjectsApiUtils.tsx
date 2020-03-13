import React from "react";

import { BusinessObjectsApiImpl, IBusinessObjectsApi } from "Domain/Api/BusinessObjectsApi";

const businessObjectsApiPrefix = "/business-objects/";

export interface BusinessObjectsApiProps {
    businessObjectsApi: IBusinessObjectsApi;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export const businessObjectsApi =
    process.env.API === "fake"
        ? new (require("./BusinessObjectsApiFake").BusinessObjectsApiFake)()
        : new BusinessObjectsApiImpl(businessObjectsApiPrefix);

const defaultContext: BusinessObjectsApiProps = { businessObjectsApi: businessObjectsApi };
const BusinessObjectsApiContext: React.Context<BusinessObjectsApiProps> = React.createContext(defaultContext);

export function withBusinessObjectsApi<TProps extends BusinessObjectsApiProps>(
    Comp: React.ComponentType<TProps>
): React.ComponentType<Omit<TProps, keyof BusinessObjectsApiProps>> {
    return function withBusinessObjectsApiWrapper(props: Omit<TProps, keyof BusinessObjectsApiProps>): JSX.Element {
        return (
            <BusinessObjectsApiContext.Consumer>
                {context => (
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    <Comp {...props} {...context} />
                )}
            </BusinessObjectsApiContext.Consumer>
        );
    };
}

export function BusinessObjectsApiProvider(props: React.PropsWithChildren<BusinessObjectsApiProps>) {
    return <BusinessObjectsApiContext.Provider value={props}>{props.children}</BusinessObjectsApiContext.Provider>;
}
