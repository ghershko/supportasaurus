const { google } = require('googleapis');


const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'],
});

google.options({ auth });

const sheetsAPI = google.sheets('v4');

const getSpecificSheet = async (spreadsheetId, sheetName) => {
  try {
    const response = await sheetsAPI.spreadsheets.get({
      spreadsheetId,
      ranges: sheetName,
      includeGridData: true, 
    });

    const { data } = response.data.sheets[0]; 
    return data[0];
  } catch (error) {
    console.error('The shhet API returned an error: ' + error);
    return null;
  }
};

module.exports = { getSpecificSheet };
