import { configure, mount, ReactWrapper, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

export { shallow, configure, mount, ReactWrapper };
