import { RowStack } from "@skbkontur/react-stack-layout";
import { Button } from "@skbkontur/react-ui";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { DecoratorFunction } from "@storybook/addons";
import React from "react";

export function ValidationContainerWithSubmitButton(): DecoratorFunction<React.ReactElement<unknown>> {
    return function ValidationContainerWithSubmitButtonDecorator(
        story: () => React.ReactNode
    ): React.ReactElement<unknown> {
        return <ValidationContainerWithSubmitButtonWrapper>{story()}</ValidationContainerWithSubmitButtonWrapper>;
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
