import { action, storiesOf } from "@kadira/storybook";
import * as React from "react";
import { ButtonLink } from "ui";
import { CommonLayout } from "Commons/Layouts/CommonLayout";
import { Fill } from "Commons/Layouts/Fill";
import { Fit } from "Commons/Layouts/Fit";
import { RowStack } from "Commons/Layouts/RowStack";
import { ScrollableContainer } from "Commons/Layouts/ScrollableContainer";

import AddIcon from "@skbkontur/react-icons/Add";
import MenuIcon from "@skbkontur/react-icons/Menu";
import RubleIcon from "@skbkontur/react-icons/Ruble";
import SearchIcon from "@skbkontur/react-icons/Search";

function SpaceFiller(props: { width?: number | string; height?: number | string }): JSX.Element {
    return (
        <div
            style={{
                height: props.height,
                width: props.width,
                border: "1px solid #dee0e3",
                boxSizing: "border-box",
                color: "#dee0e3",
                textShadow: "0 0 20px #ffffff, 0 0 20px #ffffff",
                display: "flex",
                flexFlow: "column",
                flex: "1 1 auto",
                alignItems: "center",
                justifyContent: "center",
                background: "repeating-linear-gradient(45deg, #fafafa, #fafafa 10px, #ffffff 10px, #ffffff 20px )",
            }}>
            Children
        </div>
    );
}
storiesOf(module)
    .add("BackToPreviousViewLayout", () => (
        <div style={{ height: 300 }}>
            <CommonLayout>
                <CommonLayout.GoBack href="http://google.com">Назад в google</CommonLayout.GoBack>
                <CommonLayout.Content>
                    <SpaceFiller height="100%" />
                </CommonLayout.Content>
            </CommonLayout>
        </div>
    ))
    .add("TitledLayout", () => (
        <div style={{ height: 300 }}>
            <CommonLayout>
                <CommonLayout.Header title="Заголовок раздела" />
                <CommonLayout.Content>
                    <SpaceFiller height="100%" />
                </CommonLayout.Content>
            </CommonLayout>
        </div>
    ))
    .add("TitledLayoutWithTools", () => (
        <div style={{ height: 300 }}>
            <CommonLayout>
                <CommonLayout.Header
                    title="Заголовок раздела"
                    tools={
                        <RowStack baseline block gap={2}>
                            <Fit>
                                <ButtonLink icon={<SearchIcon />} onClick={action("tool1")}>
                                    Инструмент 1
                                </ButtonLink>
                            </Fit>
                            <Fit>
                                <ButtonLink icon={<AddIcon />} onClick={action("tool2")}>
                                    Инструмент 1
                                </ButtonLink>
                            </Fit>
                        </RowStack>
                    }
                />
                <CommonLayout.Content>
                    <SpaceFiller height="100%" />
                </CommonLayout.Content>
            </CommonLayout>
        </div>
    ))
    .add("TitledLayoutWithRightAlignedTools", () => (
        <div style={{ height: 300 }}>
            <CommonLayout>
                <CommonLayout.Header
                    title="Заголовок раздела"
                    tools={
                        <RowStack baseline block gap={2}>
                            <Fill />
                            <Fit>
                                <ButtonLink icon={<SearchIcon />} onClick={action("tool1")}>
                                    Инструмент 1
                                </ButtonLink>
                            </Fit>
                            <Fit>
                                <ButtonLink icon={<AddIcon />} onClick={action("tool2")}>
                                    Инструмент 1
                                </ButtonLink>
                            </Fit>
                        </RowStack>
                    }
                />
                <CommonLayout.Content>
                    <SpaceFiller height="100%" />
                </CommonLayout.Content>
            </CommonLayout>
        </div>
    ))
    .add("TitledWithBackToPrevious", () => (
        <div style={{ height: 300 }}>
            <CommonLayout>
                <CommonLayout.GoBack href="http://google.com">Назад в google</CommonLayout.GoBack>
                <CommonLayout.Header title="Заголовок раздела" />
                <CommonLayout.Content>
                    <SpaceFiller height="100%" />
                </CommonLayout.Content>
            </CommonLayout>
        </div>
    ))
    .add("GreyLineTitledWithBackToPrevious", () => (
        <div style={{ height: 300 }}>
            <CommonLayout>
                <CommonLayout.GoBack href="http://google.com">Назад в google</CommonLayout.GoBack>
                <CommonLayout.GreyLineHeader title="Заголовок раздела" />
                <CommonLayout.Content>
                    <SpaceFiller height="100%" />
                </CommonLayout.Content>
            </CommonLayout>
        </div>
    ))
    .add("GreyLineTitledWithBackToPreviousWithTools", () => (
        <div style={{ height: 300 }}>
            <CommonLayout>
                <CommonLayout.GoBack href="http://google.com">Назад в google</CommonLayout.GoBack>
                <CommonLayout.GreyLineHeader
                    title="Заголовок раздела"
                    tools={
                        <RowStack baseline block gap={2}>
                            <Fit>
                                <ButtonLink icon={<SearchIcon />} onClick={action("tool1")}>
                                    Инструмент 1
                                </ButtonLink>
                            </Fit>
                            <Fit>
                                <ButtonLink icon={<AddIcon />} onClick={action("tool2")}>
                                    Инструмент 1
                                </ButtonLink>
                            </Fit>
                        </RowStack>
                    }
                />
                <CommonLayout.Content>
                    <SpaceFiller height="100%" />
                </CommonLayout.Content>
            </CommonLayout>
        </div>
    ))
    .add("GreyLineTitledWithBackToPreviousWithRightAlignedTools", () => (
        <div style={{ height: 300 }}>
            <CommonLayout>
                <CommonLayout.GoBack href="http://google.com">Назад в google</CommonLayout.GoBack>
                <CommonLayout.GreyLineHeader
                    title="Заголовок раздела"
                    tools={
                        <RowStack baseline block gap={2}>
                            <Fill />
                            <Fit>
                                <ButtonLink icon={<SearchIcon />} onClick={action("tool1")}>
                                    Инструмент 1
                                </ButtonLink>
                            </Fit>
                            <Fit>
                                <ButtonLink icon={<AddIcon />} onClick={action("tool2")}>
                                    Инструмент 1
                                </ButtonLink>
                            </Fit>
                        </RowStack>
                    }
                />
                <CommonLayout.Content>
                    <SpaceFiller height="100%" />
                </CommonLayout.Content>
            </CommonLayout>
        </div>
    ))
    .add("GreyLineTitledWithBackToPreviousWithRightAlignedToolsAndContent", () => (
        <div style={{ height: 300 }}>
            <CommonLayout>
                <CommonLayout.GoBack href="http://google.com">Назад в google</CommonLayout.GoBack>
                <CommonLayout.GreyLineHeader
                    title="Заголовок раздела"
                    tools={
                        <RowStack baseline block gap={2}>
                            <Fill />
                            <Fit>
                                <ButtonLink icon={<SearchIcon />} onClick={action("tool1")}>
                                    Инструмент 1
                                </ButtonLink>
                            </Fit>
                            <Fit>
                                <ButtonLink icon={<AddIcon />} onClick={action("tool2")}>
                                    Инструмент 1
                                </ButtonLink>
                            </Fit>
                        </RowStack>
                    }>
                    <div>
                        <div>Content line 1</div>
                        <div>Content line 2</div>
                        <div>Content line 3</div>
                    </div>
                </CommonLayout.GreyLineHeader>
                <CommonLayout.Content>
                    <SpaceFiller height="100%" />
                </CommonLayout.Content>
            </CommonLayout>
        </div>
    ))
    .add("GreyLineTitledWithBackToPreviousWithRightAlignedToolsAndContentAndLongHeaderText", () => (
        <div style={{ height: 300 }}>
            <CommonLayout>
                <CommonLayout.GoBack href="http://google.com">Назад в google</CommonLayout.GoBack>
                <CommonLayout.GreyLineHeader
                    title={
                        "Заголовок 636716756516841227_DdDoc_then_EdiDoc__04.09.2018" +
                        "636716756516841227_DdDoc_then_EdiDoc__04.09.2018"
                    }
                    tools={
                        <RowStack baseline block gap={2}>
                            <Fill />
                            <Fit>
                                <ButtonLink icon={<SearchIcon />} onClick={action("tool1")}>
                                    Инструмент 1
                                </ButtonLink>
                            </Fit>
                            <Fit>
                                <ButtonLink icon={<AddIcon />} onClick={action("tool2")}>
                                    Инструмент 2
                                </ButtonLink>
                            </Fit>
                            <Fit>
                                <ButtonLink icon={<MenuIcon />} onClick={action("tool3")}>
                                    Инструмент 3
                                </ButtonLink>
                            </Fit>
                            <Fit>
                                <ButtonLink icon={<RubleIcon />} onClick={action("tool4")}>
                                    Инструмент 4
                                </ButtonLink>
                            </Fit>
                        </RowStack>
                    }>
                    <div>
                        <div>Content line 1</div>
                        <div>Content line 2</div>
                        <div>Content line 3</div>
                    </div>
                </CommonLayout.GreyLineHeader>
                <CommonLayout.Content>
                    <SpaceFiller height="100%" />
                </CommonLayout.Content>
            </CommonLayout>
        </div>
    ))
    .add("Большой контент", () => (
        <div style={{ maxWidth: "600px" }}>
            <ScrollableContainer>
                <SpaceFiller width="2000px" height="2000px" />
            </ScrollableContainer>
        </div>
    ));
