import * as React from "react";
import {storiesOf} from "@storybook/react";
import {BrowserExecutionContext} from "./EnvironmentContexts/BrowserExecutionContext";

var a = {};
const configuration = {};

export function slow() {
    return configuration;
}

export function timeout() {
    return configuration;
}

export function suite(target) {
    if (target === configuration) {
        return suiteDecorator;
    }
    return suiteDecorator(target);
}

function suiteDecorator(target) {
    if (target === configuration) {
        return function () {

        }
    }
    a[target.name] = a[target.name] || {
        stories: [],
    };
    a[target.name].storyConfig = storiesOf(target.name, module);
    for (const story of a[target.name].stories) {
        console.log(a[target.name].storyConfig);
        story(a[target.name].storyConfig);
    }
}

export function test(instance, name, prop) {
    const storyName = instance.constructor.name;
    a[storyName] = a[storyName] || { stories: [] };
    a[storyName].stories.push((storyConfig) => {
        storyConfig.add(name, () => {
            BrowserExecutionContext.externalInstances = {};
            BrowserExecutionContext.externalObjectsCounter = 0;
            return <AllowPromiseChild>
                {async () => {
                    var a = new instance.constructor();
                    try {
                        if (typeof a['before'] === 'function') {
                            a['before']();
                        }
                        await a[name]();
                    }
                    catch (e) {
                        if (e.result != null) {
                            return e.result;
                        }
                        throw e;
                    }
                }}
            </AllowPromiseChild>
        });
    })
}

class AllowPromiseChild extends React.Component {
    state = {
        childrenResult: <noscript />
    };

    constructor(props) {
        super(props);
        props.children().then((x) => this.setState({
            childrenResult: x
        }));
    }

    render() {
        return this.state.childrenResult;
    }
}

export function context() {}
