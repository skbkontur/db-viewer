import _ from "lodash";

export const idx = propertyPickerFunction => {
    return view(pathLens(propertyPickerFunction));
};

export function pathLens(propertyPicker) {
    const fieldsString = /return [^\{\}\(\)]*?\.([^\{\}\(\)]*?)\s*[;\}]/.exec(propertyPicker.toString())[1];
    return {
        get: x => _.get(x, fieldsString),
        set: (x, value) => {
            return fieldsString
                .split(".")
                .reduce((result, path, index) => {
                    const target = result[index - 1] ? result[index - 1][2] : x;
                    return [...result, [path, target, target == null ? null : target[path]]];
                }, [])
                .reduceRight((nextValue, [path, target]) => {
                    return {
                        ...target,
                        [path]: nextValue,
                    };
                }, value);
        },
    };
}

export function getPath(propertyPicker) {
    const fieldsString = /return [^\{\}\(\)]*?(\.([^\{\}\(\)]*?))?\s*[;\}]/.exec(propertyPicker.toString());
    if (fieldsString == undefined) {
        throw new Error(`Cannot extract path from function: ${propertyPicker.toString()}`);
    }
    if (fieldsString != undefined && fieldsString[2] == undefined) {
        return [];
    }
    return fieldsString[2].replace(/\[/g, '.').replace(/]/, '').split(".");

}

export function view(lens, target) {
    return lens.get(target);
}

export function set(lens, value, target) {
    return lens.set(target, value);
}
