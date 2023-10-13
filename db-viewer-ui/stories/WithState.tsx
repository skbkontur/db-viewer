import React from "react";

interface WithStateProps<S> {
    initial: S;
    children: (
        state: S,
        setState: (update: Partial<S>) => void,
        replaceState: (update: S) => void
    ) => React.ReactElement;
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

    public render(): React.ReactElement {
        return this.props.children(
            this.state.state,
            (x: Partial<S>) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this.setState({ state: { ...this.state.state, ...x } });
            },
            (x: S) => {
                this.setState({ state: x });
            }
        );
    }
}
