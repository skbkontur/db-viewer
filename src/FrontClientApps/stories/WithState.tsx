import * as React from "react";

interface WithStateProps<S> {
    initial: S;
    children: (state: S, setState: (update: Partial<S>) => void, replaceState: (update: S) => void) => JSX.Element;
}

interface WithStateState<S> {
    state: S;
}

export class WithState<S> extends React.Component<WithStateProps<S>, WithStateState<S>> {
    public state: WithStateState<S>;

    public constructor(props: WithStateProps<S>) {
        super(props);
        this.state = { state: props.initial };
    }

    public render(): JSX.Element {
        return this.props.children(
            this.state.state,
            (x: Partial<S>) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                this.setState({ state: { ...this.state.state, ...x } });
            },
            (x: S) => {
                this.setState({ state: x });
            }
        );
    }
}
