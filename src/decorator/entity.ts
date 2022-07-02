export function entity()
{
    return function (constructor: object) {
        console.log(constructor);
        Object.seal(constructor);
    }
}