import 'babel-polyfill';
import {configure, setAddon, addDecorator} from '@storybook/react';
import {withConsole} from '@storybook/addon-console';

addDecorator((storyFn, context) => withConsole()(storyFn)(context));

const req = require.context('../src/components/', true, /.stories.tsx$/);

function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
