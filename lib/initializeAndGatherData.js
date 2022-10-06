import {arraySet, arrayToDot} from "./index";

function getFromObject(object, path) {
  let keys = path.split(".").reverse();

  while (
    keys.length &&
    (object = object[keys.pop()]) !== undefined &&
    object !== null
  );

  return object;
}

function extractValuesForWildcards(masterData, data, attribute) {
  let result = {...masterData};

  let pattern = new RegExp(attribute.replaceAll("*", "[^.]*") + "$");

  for (let attr in data) {
    if (pattern.test(attr)) {
      result[attr] = getFromObject(masterData, attr);
    }
  }

  return result;
}

function initializeAttributeOnData(attribute, masterData) {
  return arraySet({...masterData}, attribute, null, true);
}

export default function initializeAndGatherData(attribute, data) {
  let result = arrayToDot(initializeAttributeOnData(attribute, data));
  return extractValuesForWildcards(data, result, attribute);
}
