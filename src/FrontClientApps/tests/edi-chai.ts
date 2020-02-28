// tslint:disable
import chai, { expect as chaiExpect } from "chai";
import chaiDom from "chai-dom";
chai.use(chaiDom);

export default chai;
export const expect = chaiExpect;
