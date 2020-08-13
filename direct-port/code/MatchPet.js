// Much smaller than the Alexa Node.js code
// Most of Bixby development is done in the model, not in the JS

var console = require('console')
var http = require('http')
var fail = require('fail');

const petMatchApi = "https://e4v7rdwl7l.execute-api.us-east-1.amazonaws.com/Test"

module.exports.function = function MatchPet(animal, energy, size, temperament, location, shedding) {
// animal used for validation, not in JS
// location and shedding in Alexa skill but not used for Alexa or Bixby
  var options = {
    format: "json",
    query: {
      "SSET": buildPetMatchParams(energy, size, temperament)
    }
  }

  try {
    // No promise or call back need, the Bixby JS API handles for you
    var response = http.getUrl(petMatchApi, options)
  } catch (error) {
    console.log ("Error: " + response)
    throw fail.checkedError(response,"APIError") // See the MatchPet action which handles this error
  }

  //console.log ("response = " + JSON.stringify(response))
  if (response.result[0]) {
    return response.result[0].breed;
  } else return null;
}

function buildPetMatchParams(energy, size, temperament) {
  return "canine-" + energy + "-" + size + "-" + temperament
}
