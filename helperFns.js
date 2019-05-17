/**
 * Given a string of putative AGI check if it is an AGI
 * @param listOfAGIsorAGI {string} AGIs
 * @returns {boolean}
 */
function chkAndAGINames(listOfAGIsorAGI){
  if (typeof listOfAGIsorAGI === "string"){
    return !!listOfAGIsorAGI.match(/^AT[1-5MC]G\d{5}$/i);
  }
}

module.exports = {chkAndAGINames};