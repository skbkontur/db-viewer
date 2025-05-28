import { RowStack } from "@skbkontur/react-stack-layout";
import { Button } from "@skbkontur/react-ui";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import React from "react";

const ValidationContainerWithSubmitButtonWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [caption, setCaption] = React.useState<React.ReactNode | null>(null);
    const containerRef = React.useRef<ValidationContainer | null>(null);

    const handleSubmit = async () => {
        if (containerRef.current != null) {
            const isValid = await containerRef.current.validate();
            setCaption(
                isValid ? (
                    <div style={{ color: "green" }}>Форма валидна</div>
                ) : (
                    <div style={{ color: "red" }}>Форма не валидна</div>
                )
            );
        }
    };

    return (
        <ValidationContainer ref={containerRef}>
            <div>
                <div>{children}</div>
                <RowStack gap={1} verticalAlign="center">
                    <Button use="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                    {caption}
                </RowStack>
            </div>
        </ValidationContainer>
    );
};

export const ValidationContainerWithSubmitButton = () => {
    const StoryWrapper = (story: () => React.ReactNode) => (
        <ValidationContainerWithSubmitButtonWrapper>{story()}</ValidationContainerWithSubmitButtonWrapper>
    );
    StoryWrapper.displayName = "ValidationContainerWithSubmitButton";
    return StoryWrapper;
};
