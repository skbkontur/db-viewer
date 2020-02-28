import * as React from "react";

interface Props<T> {
    load(): Promise<T>;
    children(x: T): JSX.Element;
}

interface State<T> {
    mod?: T;
}

export class Bundle<T> extends React.Component<Props<T>, State<T>> {
    public props: Props<T>;
    public state: State<T> = {
        mod: undefined,
    };

    public componentWillMount(): void {
        this.load(this.props);
    }

    public componentWillReceiveProps(nextProps: Props<T>): void {
        if (nextProps.load !== this.props.load) {
            this.load(nextProps);
        }
    }

    public render(): null | JSX.Element {
        const { children } = this.props;
        const { mod } = this.state;
        return mod != undefined ? children(mod) : null;
    }

    private async load(props: Props<T>): Promise<void> {
        this.setState({
            mod: undefined,
        });
        const result = await props.load();
        this.setState({
            mod: result,
        });
    }
}
