// Much smaller than the Alexa Node.js code
// Most of Bixby development is done in the model, not in the JS

var console = require('console')
var http = require('http')
var fail = require('fail');

// Use local data or call API
const local = true;

const petData = require('./PetMatch.js');
const petMatchApi = "https://e4v7rdwl7l.execute-api.us-east-1.amazonaws.com/Test"

module.exports.function = function MatchPet(animal, energy, size, temperament, location, shedding, $vivContext) {
  // animal used for validation, not in JS
  // location and shedding in Alexa skill but not used for Alexa or Bixby
  
  let params = buildPetMatchParams(energy, size, temperament,$vivContext)
  let breed, description, image;

  // No localized data via API or locally, add a locale to data for localization and use $vivContext to get user locale
  let locale = $vivContext.locale;

  if (local) {
    let dog = petData[params];
    if (dog) {
      breed = dog.breed;
      description = dog.description;
      image = dog.image;
    }
  } else {
    let options = {
      format: "json",
      query: {
        "SSET": "canine-" + params
      }
    }
    try {
      // No promise or call back need, the Bixby JS API handles for you
      var response = http.getUrl(petMatchApi, options)
    } catch (error) {
      console.log("Error: " + response);
      throw fail.checkedError(response, "APIError"); // See the MatchPet action which handles this error
    }
    breed = response.result[0] ? capitalizeAllWords(response.result[0].breed) : null
  }

  if (breed) {
    return {
      breed: breed,
      description: description,
      image: image
    }
  } else return null;
}

function buildPetMatchParams(energy, size, temperament) {
  return energy + "-" + size + "-" + temperament;
}

// API returns lower case, capitalize all words
function capitalizeAllWords (string) {
  return string.replace(/\b\w/g, l => l.toUpperCase())
}
