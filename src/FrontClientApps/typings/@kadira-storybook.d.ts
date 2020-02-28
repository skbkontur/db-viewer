declare module "@kadira/storybook" {
    interface StoryIdentity {
        kind: string;
        story: string;
    }

    type StoryFactory = (identity: StoryIdentity) => React.ReactNode;

    interface IStoryConfig {
        add(name: string, story: StoryFactory): IStoryConfig;
        addDecorator(storyDecorator: (storyFactory: () => React.ReactNode) => React.ReactNode): IStoryConfig;
    }

    function storiesOf(module: any): IStoryConfig;
    function action<T>(name: string): any;
}

declare module "@storybook/addon-knobs/react" {
    export const withKnobs: any;
    export function object<T>(name: string, value: T): T;
}
