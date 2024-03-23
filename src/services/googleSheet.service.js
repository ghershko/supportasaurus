const { google } = require('googleapis');


const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'],
});

google.options({ auth });

const sheetsAPI = google.sheets('v4');

const getSpecificSheet = async (spreadsheetId, ranges) => {
  try {
    const response = await sheetsAPI.spreadsheets.get({
      spreadsheetId,
      ranges,
      includeGridData: true, 
    });

    const { data } = response.data.sheets[0]; 
    return data[0];
  } catch (error) {
    console.error('The shhet API returned an error on fetch: ' + error);
    return null;
  }
};

const updateSheet = async (spreadsheetId, range, values) => {
  try {
    const request = {
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED', // or 'RAW'
      resource: {
        values,
      },
    };

    const response = await sheetsAPI.spreadsheets.values.update(request);
    console.log('Update response', response.data);
    return response.data;
  } catch (error) {
    console.error('The sheet API returned an error on update: ' + error);
    throw new Error()
  }
};

module.exports = { getSpecificSheet, updateSheet };
