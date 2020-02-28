import { storiesOf } from "@kadira/storybook";
import * as React from "react";
import StoryRouter from "storybook-react-router";
import { PageNavigationList } from "Commons/PageNavigationList/PageNavigationList";

const commonProps = {
    createHrefToPage: (x: number) => `/page/${x}`,
};

storiesOf(module)
    .addDecorator(StoryRouter())
    .add("Default", () => <PageNavigationList current={0} count={1} {...commonProps} />)
    .add("With option [0, 10]", () => <PageNavigationList current={0} count={10} {...commonProps} />)
    .add("With option [5, 10]", () => <PageNavigationList current={5} count={10} {...commonProps} />)
    .add("With option [55, 100]", () => <PageNavigationList current={55} count={100} {...commonProps} />)
    .add("With option [1, 100, pageLimit=50]", () => (
        <PageNavigationList current={1} count={100} limit={50} {...commonProps} />
    ))
    .add("With option [50, 100, pageLimit=50]", () => (
        <PageNavigationList current={49} count={100} limit={50} {...commonProps} />
    ))
    .add("With option [70, 100, pageLimit=50]", () => (
        <PageNavigationList current={70} count={100} limit={50} {...commonProps} />
    ));
