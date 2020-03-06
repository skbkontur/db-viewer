import * as React from "react";

interface TextHighlightProps {
    highlight: Nullable<string>;
    text: Nullable<string>;
    markTag?: string;
    caseSensitive?: boolean;
}

export class TextHighlight extends React.Component<TextHighlightProps> {
    public container: Nullable<HTMLElement>;

    public static defaultProps = {
        markTag: "mark",
        caseSensitive: false,
    };

    public componentDidMount() {
        this.updateDOM();
    }

    public componentDidUpdate() {
        this.updateDOM();
    }

    public updateDOM() {
        const { highlight, text, markTag, caseSensitive } = this.props;
        const container = this.container;

        if (container != null) {
            container.innerHTML = this.mark(highlight, text, markTag, caseSensitive) || "";
        }
    }

    public mark(
        value: Nullable<string> = "",
        subjectString: Nullable<string>,
        markTag: string = "mark",
        caseSensitive: boolean = false
    ): Nullable<string> {
        const escapedValue = (value || "").replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
        const tagStr = "<{tag}>$&</{tag}>";

        if ((value || "").length === 0) {
            return subjectString;
        }
        if (!subjectString) {
            return subjectString;
        }
        return subjectString.replace(
            RegExp(escapedValue, caseSensitive ? "g" : "gi"),
            tagStr.replace(/{tag}/gi, markTag)
        );
    }

    public render(): JSX.Element {
        return <span className="TextHighlight" ref={x => (this.container = x)} />;
    }
}
