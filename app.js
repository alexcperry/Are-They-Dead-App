const https = require('https');
const personName = "";


const toTitleCase = str => {
  return str.replace(
    /\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

const en2wikiLookupName = str => {
  const titleCase = toTitleCase(str);
  return titleCase.replace(' ', '_');
}

const wiki2enLookupName = str => {
  return str.replace('_', ' ');
}

const hasDied = wikiHTML => {
  return !wikiHTML.includes('[[Category:Living people]]');
}


const lookup = name => {

  name = en2wikiLookupName(name);

  const request = https.get(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&rvprop=content&titles=${name}`, response => {

    let body = "";

    response.on('data', data => {
      body += data.toString();
    })

    response.on('end', () => {
      let wikiJSON = JSON.parse(body);
      const page = wikiJSON.query.pages;
      const pageId = Object.keys(wikiJSON.query.pages)[0];
      const htmlContent = (page[pageId].revisions[0]['*']);

      const englishName = wiki2enLookupName(name);

      if (hasDied(htmlContent)) {
        console.log(`${englishName} is dead.`);
      } else {
        console.log(`${englishName} is alive.`);
      }

    })


  });
}

let inputName = process.argv.slice(2);
inputName = inputName.join(' ');

lookup(inputName);

