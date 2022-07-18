function test(name, testFunction) {
    console.group(name);
    testFunction();
    console.groupEnd(name);
  }

// Check if two values are strictly equal
function assertEquals(expected, actual) {
    if (expected === actual) {
        return console.info(`Pass: the values are equal`);
    } else {
         if(Array.isArray(expected)) {
            return equalToThisArray(expected, actual);
        } else if(expected instanceof Object) {
            return equalToThisObject(expected, actual);
        }
        checkNotEquals(expected, actual);
    }
}

// Check for errors between two strings or types
const checkNotEquals = (value1, value2) => {
    if(typeof value1 === "string" && typeof value2 === "string"){
        return checkStringCaseType(value1, value2);
    } else {
        return checkDifferentTypes(value1, value2);
    }
}

// Check if two strings on the lower case type are equal
const checkStringCaseType = (string1, string2) => {
    if (string1.toLowerCase() === string2.toLowerCase()) {
        throw new Error(`Expected "${string1}" but found "${string2}". Please check the string type case.`);
    } else {
        throw new Error(`Expected "${string1}" but found "${string2}"`);
    }
}

// Check if an array is equal to other value
const equalToThisArray = (arr1, value) =>{
    if (Array.isArray(value)) {
        if (arr1.length !== value.length) {
            throw new Error(`Expected the array length to be ${arr1.length} but found ${value.length}`);
        } else {
            for (var i = 0; i < arr1.length; i++) {
                // Check if we have nested arrays
                if ( Array.isArray(arr1[i]) && Array.isArray(value[i])) {
                    // recurse into the nested arrays
                    equalToThisArray(arr1[i], value[i]);
                } else if (arr1[i] instanceof Object) {
                    equalToThisObject(arr1[i], value[i])
                }          
                else if (arr1[i] !== value[i]) { 
                    return checkNotEquals(arr1[i], value[i]);
                }           
            } 
            return true; 
        }
    } else {
        throw new Error(`Expected an array but found ${value !== null ? typeof value : null}`)
    }
}
// check if an object is equal to another value
const equalToThisObject = (obj, value) => {
    if(value instanceof Object && !Array.isArray(value)) {
        for (prop in obj) {
            // Check if all the keys of obj are in the value object
            if (obj.hasOwnProperty(prop) !== value.hasOwnProperty(prop)) {
                throw new Error(`Expected the  property ${prop} but it's not there.`);
            }

            if (obj[prop] !== value[prop]) {
                // Check if it have an array in them
                if (Array.isArray(obj[prop])) {
                    equalToThisArray(obj[prop], value[prop]);
                    // Check if it have nested objects
                } else if (obj[prop] instanceof Object) {
                    equalToThisObject(obj[prop], value[prop]);
                } else {
                    // If neither, check for different values
                    checkNotEquals(obj[prop], value[prop]);
                }
            }
        }

        // Check that the value object doesn't have unexpected keys
        for (prop in value) {
            if (obj.hasOwnProperty(prop) !== value.hasOwnProperty(prop)) {
                throw new Error(`The property ${prop} does not exist in the expected object`);
            }
        }
        // They are the same
        return true;
    } else {
        checkDifferentTypes(obj, value)
    }
}



// Check if either values is an array and reflect that in the error message
const isArray = (value1, value2) => {
    if(Array.isArray(value2)) {
        throw new Error(`Expected type ${value1 !== null ? typeof value1 : null} but found array`);
    }
    if(Array.isArray(value1)) {
        throw new Error(`Expected type array but found ${value2 !== null ? typeof value2 : null}`);
    }
}

// Check if either values is null and reflect that in the error message
const isNull = (value1, value2) => {
    if (value1 === null) {
        throw new Error(`Expected type null but found ${Array.isArray(value2) ? 'array' : typeof value2}`);
    } else if (value2 === null) {
        throw new Error(`Expected type ${Array.isArray(value1) ? 'array' : typeof value1} but found null`);
    }
}

// Check different types and throw the appropriate error
const checkDifferentTypes = (value1, value2) => {
    isArray(value1, value2);
    isNull(value1, value2);

    if (typeof value1 !== typeof value2) {
        throw new Error(`Expected type ${typeof value1} but found ${typeof value2}`);
    }
    throw new Error(`Expected ${value1} but found ${value2}`);
}