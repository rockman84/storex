import {BaseObject} from "../../lib/base/BaseObject";

class TestObject extends BaseObject {
    public id? : string;
    public hallo?: string;
    public attributes(): Object {
        return ['id'];
    }
}

const Base = new TestObject();

test('test class', () => {

    expect(Base).toBeInstanceOf(BaseObject);
    expect(Base.getAttributes()).toMatchObject({id: 1, name: 'Test'});
    expect(Base.hasAttribute('id')).toBeTruthy();
    expect(Base.hasAttribute('name')).toBeTruthy();
    expect(Base.hasAttribute('status')).toBeFalsy();
    // expect(Base.id).toBeFalsy();
});