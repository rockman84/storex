import {BaseObject} from "../../src";
import {attribute} from "../../lib/decorator/attributes";

class TestObject extends BaseObject {
    @attribute
    public id : string = '123';

    @attribute
    public name: string = 'testname';

    public status: string = 'active';
}

const Base = new TestObject();

test('test class', () => {

    expect(Base).toBeInstanceOf(BaseObject);

    expect(Base.hasAttribute('id')).toBeTruthy();
    expect(Base.hasAttribute('name')).toBeTruthy();
    expect(Base.hasAttribute('status')).toBeFalsy();

    Base.name = 'namabaru';
    expect(Base.attributes).toMatchObject({id: '123', name: 'namabaru'});
    expect(Base.name).toEqual('namabaru');

});