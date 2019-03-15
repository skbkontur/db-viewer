import 'babel-polyfill';
import {configure, setAddon, addDecorator} from '@storybook/react';
import {withKnobs} from '@storybook/addon-knobs/react';
import {withConsole} from '@storybook/addon-console';
import JSXAddon from 'storybook-addon-jsx';

addDecorator(withKnobs);
setAddon(JSXAddon);
addDecorator((storyFn, context) => withConsole()(storyFn)(context));

const req = require.context('../src/components/', true, /.stories.(jsx|tsx)$/);

function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
