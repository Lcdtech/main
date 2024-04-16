const express = require("express");
const { google } = require("googleapis");
const app = express();
const fs = require("fs");
const { dataStructured } = require("./data");


app.use(express.urlencoded({ extended: true }));

const getData = async() => {
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    const client = auth.getClient();
    const googleSheet = google.sheets({ version: "v4", auth: client });
    const spreadsheetId = "1jZTgOYW5rbljnEOR_WcnB_lu-ImpMi6y0m9DMCuG6Qg";
    const metaData = await googleSheet.spreadsheets.get({ auth, spreadsheetId });
    //   console.log(metaData);
    const getRows = await googleSheet.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "Web",
    });
    fs.writeFile("data.json", JSON.stringify(getRows.data.values), (err) => {
      if (err) throw err;
      console.log("Created Json SuccessFully");
      dataStructured()
    });
    //   console.log(getRows.data.values);
}
getData();


// app.get("/", async (req, res) => {
//   const auth = new google.auth.GoogleAuth({
//     keyFile: "credentials.json",
//     scopes: "https://www.googleapis.com/auth/spreadsheets",
//   });

//   const client = auth.getClient();

//   const googleSheet = google.sheets({ version: "v4", auth: client });

//   const spreadsheetId = "1jZTgOYW5rbljnEOR_WcnB_lu-ImpMi6y0m9DMCuG6Qg";

//   const metaData = await googleSheet.spreadsheets.get({ auth, spreadsheetId });
//   //   console.log(metaData);
//   const getRows = await googleSheet.spreadsheets.values.get({
//     auth,
//     spreadsheetId,
//     range: "Web",
//   });
//   fs.writeFile("data.json", JSON.stringify(getRows.data.values), (err) => {
//     if (err) throw err;
//     console.log("Created Json SuccessFully");
//   });
//   //   console.log(getRows.data.values);
// });

// app.listen(5000, () => {
//   console.log("server is running");
// });
