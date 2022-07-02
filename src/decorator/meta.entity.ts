interface MetaEntityObject {
    className : string,
    attributes: string[],
    hasMany: string[],
    hasOne: string[],
    index: string[],
};

export const entities : MetaEntityObject[] = [];

export const getOrCreateMeta = (className : string) : MetaEntityObject =>
{
    let meta = entities.find((item) => item.className === className);
    if (typeof meta !== 'undefined') {
        return meta;
    };
    meta = {className, attributes: [], hasMany: [], hasOne: [], index: []};
    entities.push(meta);
    return meta;
}