/* eslint-disable */
import { storiesOf as newStoriesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

const storyPathRexex = /\.\/stories\/(.*?)\.stories.(jsx?|tsx?)$/i;

export const storiesOf = (name, module, ...restArgs) => {
    if (typeof name === "object") {
        module = name;
    } else {
        console.warn(
            "Please remove story name from storiesOf(...) call (" + name + "). Use name inferred from story path"
        );
    }
    const match = storyPathRexex.exec(module.id);
    if (match == null) {
        throw new Error("Invalid story");
    }
    return newStoriesOf(match[1], module, ...restArgs);
};
export { action };
