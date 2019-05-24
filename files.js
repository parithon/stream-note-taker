let fs = require('fs');
require('dotenv').config();
let moment = require('moment');
let _template = require('lodash.template');
let markdownIt = require('markdown-it');
let md = markdownIt();

// TODO: change this back to use the env variable
let uri = './'; //process.env.WORKING_DIRECTORY;
let today = moment();
let todayDate = moment().format('YYYY-MM-DD');
let fileName = `${todayDate}.md`;
let fullUri = `${uri}${fileName}`;
let templateFileName = `template.md`;
let fullTemplateUri = `${uri}${templateFileName}`;

module.exports = {
  initTodaysStreamNotes,
  addFollower
};

function initTodaysStreamNotes() {
  let todaysStreamNotesContent = '';
  // 1. read the markdown from the template
  // 2. write that markdown to a new file for today's stream
  let templateContents = fs.readFileSync(fullTemplateUri, { encoding: 'utf8' });
  let temp = md.parseInline(templateContents, {});
  temp[0].children.forEach(token => {
    switch (token.type) {
      case 'text': {
        if (token.content.includes('Stream Notes')) {
          let compiled = _template(token.content);
          let header = compiled({
            DayName: today.format('dddd'),
            Month: today.format('MMMM'),
            Day: today.format('DD'),
            Year: today.format('YYYY')
          });
          console.log(header);
          todaysStreamNotesContent += header;
        } else {
          todaysStreamNotesContent += token.content;
        }
        break;
      }

      case 'softbreak': {
        todaysStreamNotesContent += '\n';
        break;
      }
    }
  });
  console.dir(temp[0].children);
  console.log(todaysStreamNotesContent);
}

function addFollower(username) {
  console.log(todayDate);

  let followerEntry = `- [@${{ username }}](https://twitch.tv/${{ username }})`;

  // return fs.writeFileSync(fullUri, followerEntry);
}