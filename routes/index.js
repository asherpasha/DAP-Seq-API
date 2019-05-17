var express = require('express');
var router = express.Router();
const helpFns = require('../helperFns');
const superagent = require('superagent');
const AGITrackIDsHsh = require('../AGIs-to-trackIDs');
var debug = require('debug')('dap-seq-nodejs-api:index');

router.get('/', async function(req, res, next) {
  const TF = req.query.tf.toUpperCase(), target = req.query.target.toUpperCase();
  if (!helpFns.chkAndAGINames(TF) || !helpFns.chkAndAGINames(target)) {res.status(400).send('Incorrect AGI!'); return;}

  const gnSldrURL = "https://bar.utoronto.ca/geneslider/cgi-bin/alignmentByAgi.cgi?agi=" + target;

  if (!AGITrackIDsHsh.hasOwnProperty(TF)) { // Check if TF exists in JSON database
    res.status(404).send('error: no TF track ID for given TF... Check if it exists in JSON file: <a href="https://github.com/VinLau/DAP-Seq-API">Docs</a>');
    return;
  }

  try {
    const gnSldRes = await superagent.get(gnSldrURL);
    if(!gnSldRes.ok) throw Error(gnSldRes.statusText);

    const targetLoci = gnSldRes.body.start;
    resBasedOnTrackId(targetLoci, target, AGITrackIDsHsh[TF], TF, res);
  }
  catch (e) {
    debug('error', e);
  }

});

/**
 * Either return a final URL to allow user re-direction or return a page showing multiple URLs for linkout (i.e. multiple tracks/replicates)
 * @param targetLoci - locus of target gene
 * @param targetAGI - target AGI name
 * @param TFTracks - TF tracks array
 * @param TF - TF name
 * @param res - response object
 */
function resBasedOnTrackId (targetLoci, targetAGI, TFTracks, TF, res){

  const targetChr = targetAGI.charAt(2);

  // if (TFTracks.length === 1){
    res.redirect( buildURL(targetLoci, targetChr, TFTracks));
  // }
  // else {
    // let anchorTags = [];
    // TFTracks.forEach((e, i) => {
    //   anchorTags.push(
    //     {
    //       url : buildURL(targetLoci, targetChr, TFTracks[i]),
    //       text : `Replicate ${e}`,
    //     }
    //   )});
    // res.render('multipleTrackIDs', {
    //   title: 'BAR DAP-Seq Redirection',
    //   message: `TF ${TF} contains ${TFTracks.length} two DAP-Seq replicates:`,
    //   arrayOfIDs: anchorTags
    // })
  // }
}

/**
 * Build and return a URL to Ecker lab's AnnoJ browser
 * Example URL:
 http://neomorph.salk.edu/aj2/pages/hchen/dap_ath_pub.php?active=DAP+data&location=2:8370691:600:20&hide=[%221_2%22,%222_1%22]&config=[{id:%221_2%22,height:300,scale:1.5},{id:%222_1%22,height:300,scale:1.5}]&settings={yaxis:25,accordion:%22collapsed%22}
 * @param targetLoci - locus of the target gene (start usually)
 * @param targetChrNum - chr num of the TF
 * @param TFTrackIdsArr - array of TF track ids
 * @returns {string}
 */
function buildURL(targetLoci, targetChrNum, TFTrackIdsArr){
  let baseUrl = "http://neomorph.salk.edu/aj2/pages/hchen/dap_ath_pub.php?active=DAP+data";
  const zoomLevel = "600:20";
  const geneModel = '"1_2",'; // "1_2" for TAIR, "1_1" for Araport
  const settings = 'settings={yaxis:250,accordion:"collapsed"}';
  baseUrl += "&location=" + targetChrNum + ":" + targetLoci + ":" + zoomLevel + '&hide=[' + geneModel;
  TFTrackIdsArr.forEach((e, i, arr)=>{
    baseUrl += `"${e}`;
    if (i === arr.length - 1) {
      baseUrl += '"]&config=[{id:"1_2",height:350,scale:1.25},';
      TFTrackIdsArr.forEach((e)=>{
        baseUrl += `{id:"${e}",height:250,scale:1},`
      })
    }
    else {
      baseUrl += '",';
    }
  });
  return baseUrl.substring(0, baseUrl.length-1) + "]&" + settings; // substring to remove last ',' from {id:"3_1",height:250,scale:1}
  // return (
  //   baseUrl + "&location=" + targetChrNum + ":" + targetLoci + ":" + zoomLevel + '&hide=["' + geneModel + '","' + TFTrackIdsArr + '"]&config=[{id:"1_2",height:450,scale:1.5},' + `{id:"${TFTrackIdsArr}",height:250,scale:1}]&` + settings
  // )
}


module.exports = router;