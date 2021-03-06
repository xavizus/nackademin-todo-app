function isEmpty(object) {
    if(isNull(object)) return true;
    switch(object.constructor) {
        case String:
        case Array: {
            return object.length <= 0;
        }
        case Object: {
            return Object.keys(object).length <= 0;
        }
        default: {
            throw new Error(`The input is not a supported type!`);
        }
    }
}

function isNull(object) {
    return (object == null || object == undefined) ? true : false;
}

function isNotEmpty(object) {
    return !isEmpty(object);
}

function randomNumber(min = 0, max = 100) {
    return Math.floor(Math.random() * (max+1))+min;
}

module.exports = {isEmpty, isNull, isNotEmpty, randomNumber}