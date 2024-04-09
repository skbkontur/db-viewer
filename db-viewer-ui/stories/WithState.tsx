import React from "react";

interface WithStateProps<S> {
    initial: S;
    children: (
        state: S,
        setState: (update: Partial<S>) => void,
        replaceState: (update: S) => void
    ) => React.ReactElement;
}

export const WithState = <S,>({ initial, children }: WithStateProps<S>): React.JSX.Element => {
    const [state, setState] = React.useState(initial);
    return children(
        state,
        (x: Partial<S>) => setState({ ...state, ...x }),
        (x: S) => setState(x)
    );
};
