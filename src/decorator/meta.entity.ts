interface MetaEntityObject {
    className : string,
    attributes: string[],
    hasMany: string[],
    hasOne: string[],
};

export const entities : MetaEntityObject[] = [];

export const getOrCreateMeta = (className : string) : MetaEntityObject =>
{
    let meta = entities.find((meta) => meta.className == className);
    if (typeof meta !== 'undefined') {
        return meta;
    };
    meta = {className: className, attributes: [], hasMany: [], hasOne: []};
    entities.push(meta);
    return meta;
}