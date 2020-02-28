import { ValidationContainer } from "@skbkontur/react-ui-validations";
import Button from "@skbkontur/react-ui/Button";
import * as React from "react";
import { RowStack } from "ui/layout";

import cn from "./StoryDecorators.less";

type StoryDecorator = (story: () => React.ReactNode) => React.ReactNode;

export function FixedWithDecorator(width: number | string): StoryDecorator {
    return story => (
        <div className={cn("fixed-width-container-wrap")}>
            <div className={cn("fixed-width-container")} style={{ width: width }}>
                {story()}
            </div>
        </div>
    );
}

export function NonFlexContainer(story: () => React.ReactNode): React.ReactNode {
    return <div>{story()}</div>;
}

export function PaddingContainer(padding: number): StoryDecorator {
    return function PaddingContainerDecorator(story: () => React.ReactNode): React.ReactNode {
        return <div style={{ padding: padding }}>{story()}</div>;
    };
}

export function MaxWidthContainer(maxWidth: number): StoryDecorator {
    return function MaxWidthContainerDecorator(story: () => React.ReactNode): React.ReactNode {
        return <div style={{ maxWidth: maxWidth }}>{story()}</div>;
    };
}

export function ValidationContainerWithSubmitButton(): StoryDecorator {
    return function ValidationContainerWithSubmitButtonDecorator(story: () => React.ReactNode): React.ReactNode {
        return <ValidationContainerWithSubmitButtonWrapper>{story()}</ValidationContainerWithSubmitButtonWrapper>;
    };
}

export function ValidationContainerOnly(): StoryDecorator {
    return function ValidationContainerDecorator(story: () => React.ReactNode): React.ReactNode {
        return <ValidationContainer>{story()}</ValidationContainer>;
    };
}

class ValidationContainerWithSubmitButtonWrapper extends React.Component<
    { children: React.ReactNode },
    { caption: React.ReactNode | null }
> {
    public container: null | ValidationContainer = null;
    public state = {
        caption: null,
    };

    public handleSubmit = async () => {
        if (this.container != null) {
            const isValid = await this.container.validate();
            this.setState({
                caption: isValid ? (
                    <div style={{ color: "green" }}>Форма валидна</div>
                ) : (
                    <div style={{ color: "red" }}>Форма не валидна</div>
                ),
            });
        }
    };

    public render(): JSX.Element {
        return (
            <ValidationContainer ref={x => (this.container = x)}>
                <div>
                    <div>{this.props.children}</div>
                    <RowStack gap={1} verticalAlign="center">
                        <Button use="primary" onClick={this.handleSubmit}>
                            Submit
                        </Button>
                        {this.state.caption}
                    </RowStack>
                </div>
            </ValidationContainer>
        );
    }
}
