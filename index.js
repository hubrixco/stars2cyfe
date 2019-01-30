/*
stars2cyfe main script
*/
require('dotenv').config();

const https = require('https');

// Wrapper function for retrieving info on 1 repo
// username: URL-name of github repo owner
// reponame: URL-name of github repository
// mymetric: name of metric to retrieve (must be in root of returned JSON)
// returns: value of key "mymetric" (assumed numeric, 0 on any error)
function getRepoMetric(username,reponame,mymetric) {
     https.get(`https://api.github.com/repos/${username}/${reponame}`,
          function(res) {
               var body = '';
               res.on('data', function(chunk) { body += chunk; });
               res.on('end', function() {
                    var decodedRes = JSON.parse(body);
                    var myValue = decodedRes[mymetric];
                    Console.log("getRepoMetric returns: " + mymetric + "=" + myValue);
                    return myValue;
               });
               res.on('error', function(e) {
                    Console.log("Got error: " + e.message);
                    return 0;
               });
               return 0; // pro-forma
          }
     );
     return 0; // pro-forma
}

const colors = [
     '#ffc600',
     '#bc2935',
     '#6666ff',
     '#ff9999',
     '#66ff66',
     '#ff66ff',
     '#6666ff'
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

let repoUser = process.env.ghuser;
let repoList = process.env.ghrepos.split(',');
let theMetric = process.env.ghmetric;
let dateString = dateFormat(new Date(), 'yyyymmdd');

CyfeObject.data[0].Date = dateString;

for (var i = 0, rlen = repoList.length; i < rlen; i++) {
     var theCount = getRepoMetric(repoUser, repoList[i], theMetric);
     CyfeObject.data[0][repoList[i]] = theCount;
     CyfeObject.onduplicate[repoList[i]] = 'replace';
     CyfeObject.cumulative[repoList[i]] = '1';
     CyfeObject.color[repoList[i]] = colors[i];
     CyfeObject.type[repoList[i]] = 'line'; // TODO: hard-coded, need to add logic
}

// All done! convert to JSON and spit it out

Console.log(JSON.stringify(CyfeObject));

// TODO: add push-to-Cyfe logic
// TODO: add bulletproofing / error-checking
