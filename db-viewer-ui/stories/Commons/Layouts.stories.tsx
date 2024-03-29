import { MoneyCurrencyRubleIcon16Regular } from "@skbkontur/icons/MoneyCurrencyRubleIcon16Regular";
import { PlusIcon16Regular } from "@skbkontur/icons/PlusIcon16Regular";
import { SearchLoupeIcon16Regular } from "@skbkontur/icons/SearchLoupeIcon16Regular";
import { UiMenuBars3HIcon16Regular } from "@skbkontur/icons/UiMenuBars3HIcon16Regular";
import { Fill, Fit, RowStack } from "@skbkontur/react-stack-layout";
import { Link } from "@skbkontur/react-ui";
import { action } from "@storybook/addon-actions";
import React from "react";
import { withRouter } from "storybook-addon-react-router-v6";

import { CommonLayout } from "../../src/Components/Layouts/CommonLayout";
import { ScrollableContainer } from "../../src/Components/Layouts/ScrollableContainer";

interface SpaceFilterProps {
    width?: number | string;
    height?: number | string;
}
const SpaceFiller = ({ height, width }: SpaceFilterProps): React.ReactElement => (
    <div
        style={{
            height: height,
            width: width,
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

export default {
    title: "Layouts",
    decorators: [withRouter],
};

export const BackToPreviousViewLayout = () => (
    <div style={{ height: 300 }}>
        <CommonLayout withArrow>
            <CommonLayout.GoBack to="/AdminTools" />
            <CommonLayout.Content>
                <SpaceFiller height="100%" />
            </CommonLayout.Content>
        </CommonLayout>
    </div>
);

export const TitledLayout = (): React.ReactElement => (
    <div style={{ height: 300 }}>
        <CommonLayout>
            <CommonLayout.Header title="Заголовок раздела" />
            <CommonLayout.Content>
                <SpaceFiller height="100%" />
            </CommonLayout.Content>
        </CommonLayout>
    </div>
);

export const TitledLayoutWithTools = (): React.ReactElement => (
    <div style={{ height: 300 }}>
        <CommonLayout>
            <CommonLayout.Header
                title="Заголовок раздела"
                tools={
                    <RowStack baseline block gap={2}>
                        <Fit>
                            <Link icon={<SearchLoupeIcon16Regular />} onClick={action("tool1")}>
                                Инструмент 1
                            </Link>
                        </Fit>
                        <Fit>
                            <Link icon={<PlusIcon16Regular />} onClick={action("tool2")}>
                                Инструмент 1
                            </Link>
                        </Fit>
                    </RowStack>
                }
            />
            <CommonLayout.Content>
                <SpaceFiller height="100%" />
            </CommonLayout.Content>
        </CommonLayout>
    </div>
);

export const TitledLayoutWithRightAlignedTools = (): React.ReactElement => (
    <div style={{ height: 300 }}>
        <CommonLayout>
            <CommonLayout.Header
                title="Заголовок раздела"
                tools={
                    <RowStack baseline block gap={2}>
                        <Fill />
                        <Fit>
                            <Link icon={<SearchLoupeIcon16Regular />} onClick={action("tool1")}>
                                Инструмент 1
                            </Link>
                        </Fit>
                        <Fit>
                            <Link icon={<PlusIcon16Regular />} onClick={action("tool2")}>
                                Инструмент 1
                            </Link>
                        </Fit>
                    </RowStack>
                }
            />
            <CommonLayout.Content>
                <SpaceFiller height="100%" />
            </CommonLayout.Content>
        </CommonLayout>
    </div>
);

export const TitledWithBackToPrevious = (): React.ReactElement => (
    <div style={{ height: 300 }}>
        <CommonLayout withArrow>
            <CommonLayout.GoBack to="/AdminTools" />
            <CommonLayout.Header title="Заголовок раздела" />
            <CommonLayout.Content>
                <SpaceFiller height="100%" />
            </CommonLayout.Content>
        </CommonLayout>
    </div>
);

export const TitledWithBackToPreviousWithRightAlignedToolsAndContent = (): React.ReactElement => (
    <div style={{ height: 300 }}>
        <CommonLayout withArrow>
            <CommonLayout.GoBack to="/AdminTools" />
            <CommonLayout.Header
                borderBottom
                title="Заголовок раздела"
                tools={
                    <RowStack baseline block gap={2}>
                        <Fill />
                        <Fit>
                            <Link icon={<SearchLoupeIcon16Regular />} onClick={action("tool1")}>
                                Инструмент 1
                            </Link>
                        </Fit>
                        <Fit>
                            <Link icon={<PlusIcon16Regular />} onClick={action("tool2")}>
                                Инструмент 1
                            </Link>
                        </Fit>
                    </RowStack>
                }>
                <div>
                    <div>Content line 1</div>
                    <div>Content line 2</div>
                    <div>Content line 3</div>
                </div>
            </CommonLayout.Header>
            <CommonLayout.Content>
                <SpaceFiller height="100%" />
            </CommonLayout.Content>
        </CommonLayout>
    </div>
);

export const TitledWithBackToPreviousWithRightAlignedToolsAndContentAndLongHeaderText = (): React.ReactElement => (
    <div style={{ height: 300 }}>
        <CommonLayout withArrow>
            <CommonLayout.GoBack to="/AdminTools" />
            <CommonLayout.Header
                title={
                    "Заголовок 636716756516841227_DdDoc_then_EdiDoc__04.09.2018" +
                    "636716756516841227_DdDoc_then_EdiDoc__04.09.2018"
                }
                tools={
                    <RowStack baseline block gap={2}>
                        <Fill />
                        <Fit>
                            <Link icon={<SearchLoupeIcon16Regular />} onClick={action("tool1")}>
                                Инструмент 1
                            </Link>
                        </Fit>
                        <Fit>
                            <Link icon={<PlusIcon16Regular />} onClick={action("tool2")}>
                                Инструмент 2
                            </Link>
                        </Fit>
                        <Fit>
                            <Link icon={<UiMenuBars3HIcon16Regular />} onClick={action("tool3")}>
                                Инструмент 3
                            </Link>
                        </Fit>
                        <Fit>
                            <Link icon={<MoneyCurrencyRubleIcon16Regular />} onClick={action("tool4")}>
                                Инструмент 4
                            </Link>
                        </Fit>
                    </RowStack>
                }>
                <div>
                    <div>Content line 1</div>
                    <div>Content line 2</div>
                    <div>Content line 3</div>
                </div>
            </CommonLayout.Header>
            <CommonLayout.Content>
                <SpaceFiller height="100%" />
            </CommonLayout.Content>
        </CommonLayout>
    </div>
);

export const BigContent = (): React.ReactElement => (
    <div style={{ maxWidth: "600px" }}>
        <ScrollableContainer>
            <SpaceFiller width="2000px" height="2000px" />
        </ScrollableContainer>
    </div>
);
