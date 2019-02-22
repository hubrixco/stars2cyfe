/*
stars2cyfe main script
*/
require('dotenv').config();

const syncrequest = require('sync-request');
const dateFormat = require('dateformat');

function envCheck() {
     // Validate our environmnent variables; fail harshly if no good
     if (!process.env.ghuser) {
          console.log("Required variable 'ghuser' not set in .env file");
          process.exit(1);
     };
     if (!process.env.ghrepos) {
          console.log("Required variable 'ghrepos' not set in .env file");
          process.exit(1);
          // TODO: Test ghrepos well-formed (comma-delimited string)
     };
     if (!process.env.cyfendpoint) {
          console.log("Required variable 'cyfendpoint' not set in .env file");
          process.exit(1);
     };
     if (!process.env.ghmetric) {
          // Not an error, just set it to default
          process.env.ghmetric = 'stargazers_count';
     }
}

// Wrapper function for retrieving info on 1 repo
// username: URL-name of github repo owner
// reponame: URL-name of github repository
// mymetric: name of metric to retrieve (must be in root of returned JSON)
// returns: value of key "mymetric" (assumed numeric, 0 on any error)

function getRepoMetric(username,reponame,mymetric) {

     var myValue = 0;    // store return-value in top-level variable

     /* YES!! I know sync-request should NOT be used in production apps.
     But THIS IS NOT AN APP! It's a once/day cron job. We don't plan to
     scale THIS code to check 1000s of repos. If we wanted that, it would
     be a complete rewrite (not a refactoring of this stuff).
     */
     try {
          var res = syncrequest('GET',
               `https://api.github.com/repos/${username}/${reponame}`,
               {
                    // GitHub requires User-Agent, see
                    // https://developer.github.com/v3/#user-agent-required
                    headers: {
                         'Accept': 'application/json', // probably pro-forma
                         'User-Agent': 'stars2cyfe/0.0.1'   //TODO: read this from env somehow!
                    }
               }
          );
          // Minimal error-check logic testing res.statusCode
          if (res.statusCode < 200 || res.statusCode > 399) {
               console.log(`Got ${res.statusCode} for repo ${username}/${reponame}, returning 0`);
               return myValue;
          }

          var returnedObject = JSON.parse(res.getBody());
          myValue = returnedObject[mymetric];
          // console.log("getRepoMetric returns: " + mymetric + "=" + myValue);
     }
     catch(err) {
          console.log("getRepoMetric() exception: " + err);
     }
     return myValue;
}

const colors = [
     '#ffc600',
     '#bc2935',
     '#6666ff',
     '#ff9999',
     '#66ff66',     // 5
     '#ff66ff',
     '#6666ff',
     '#ffff66',
     '#ff6666',
     '#00ff00',     // 10
     '#ff00ff',
     '#66ffff'      // 12 colors
     // TODO: need more colors or a generator
];

// Skeleton/template of Push-API JSON payload
// See https://www.cyfe.com/api

let CyfeObject = {
     data: [{}],
     onduplicate: {},
     cumulative: {},
     color: {},
     type: {}
};

envCheck(); // sanity-check on .env variables, set defaults

let repoUser = process.env.ghuser;
let repoList = process.env.ghrepos.split(',');
let theMetric = process.env.ghmetric;
let dateString = dateFormat(new Date(), 'yyyymmdd');

CyfeObject.data[0].Date = dateString;

for (var i = 0, rlen = repoList.length; i < rlen; i++) {
     var theCount = getRepoMetric(repoUser, repoList[i], theMetric);
     CyfeObject.data[0][repoList[i]] = theCount.toString(10); // force string for quotemarks
     CyfeObject.onduplicate[repoList[i]] = 'replace';
     CyfeObject.cumulative[repoList[i]] = '1';
     CyfeObject.color[repoList[i]] = colors[i];
     CyfeObject.type[repoList[i]] = 'line'; // TODO: move this to process.env ?
}

// All done! convert to JSON and spit it out
// console.log(JSON.stringify(CyfeObject,null,4));

// Push it to Cyfe
var cyferes = syncrequest('POST', process.env.cyfendpoint, { json: CyfeObject});
// TODO: add bulletproofing / error-checking
