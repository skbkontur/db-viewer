import { compose, StoreEnhancer } from "redux";

declare global {
    type Nullable<T> = null | undefined | T;
    type SyntheticEvent<T> = React.SyntheticEvent<any>;
    type SyntheticMouseEvent<T> = React.MouseEvent<any>;
    type mixed = any;
    type TimeoutID = NodeJS.Timer;
    type IntervalID = NodeJS.Timer;

    function cast<T>(a: any): T;

    interface Window {
        onunhandledrejection: any;
        devToolsExtension: any;
        __REDUX_DEVTOOLS_EXTENSION__: (() => StoreEnhancer<any>) | null | undefined;
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose | null | undefined;
        CertificatesList: any;
    }

    interface IFixtureBuilder {
        page(url: string): IFixtureBuilder;
    }
}
