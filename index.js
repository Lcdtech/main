const express = require("express");
const { google } = require("googleapis");
const fs = require("fs");
const app = express();
const path = require("path");
const { dataStructured } = require("./data");
const pathDir = path.join(__dirname, "")

app.use(express.json()); // To support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // To support URL-encoded bodies
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Adjust this to fit your needs
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});


const getDataFromSheet = async () => {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json", // Ensure this file is in your project directory and gitignored
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });
    const client = await auth.getClient();
    const googleSheet = google.sheets({ version: "v4", auth: client });
    const spreadsheetId = "1jZTgOYW5rbljnEOR_WcnB_lu-ImpMi6y0m9DMCuG6Qg";
    const range = "Web"; // Change as per your Google Sheet's sheet name

    const response = await googleSheet.spreadsheets.values.get({
        spreadsheetId,
        range,
    });
    const data =  response.data.values;
    let aray = [];  
    data.forEach((x) => {
        let obj = {
          Tier: x[0],
          "Weapon Name": x[1],
          "Weapon Type": x[2],
          "Build Type": x[3],
          Muzzle: x[4],
          Barrel: x[5],
          "Front Rail": x[6],
          Optics: x[7],
          Mag: x[8],
          "Rear Grip": x[9],
          Stock: x[10],
          Date: x[11],
        };
        aray.push(obj);
      });
    
      let weaponMap = new Map();
      let tierBuildTypes = new Map();
    
      aray.forEach((x) => {
        let weaponData = weaponMap.get(x["Tier"]);
        if (!weaponData) {
          weaponData = new Map();
          weaponMap.set(x["Tier"], weaponData);
          tierBuildTypes.set(x["Tier"], new Set());
        }
    
        let weaponArray = weaponData.get(x["Weapon Name"]);
        if (!weaponArray) {
          weaponArray = [];
          weaponData.set(x["Weapon Name"], weaponArray);
        }
    
        weaponArray.push({
          Tier: x.Tier,
          "Weapon Name": x["Weapon Name"],
          "Weapon Type": x["Weapon Type"],
          "Build Type": x["Build Type"],
          Muzzle: x["Muzzle"],
          Barrel: x["Barrel"],
          "Front Rail": x["Front Rail"],
          Optics: x["Optics"],
          Mag: x["Mag"],
          "Rear Grip": x["Rear Grip"],
          Stock: x["Stock"],
          Date: x["Date"],
        });
    
        tierBuildTypes.get(x["Tier"]).add(x["Build Type"]);
      });
    
      let mainArray = [];
    
      weaponMap.forEach((tierData, tierName) => {
        if (tierName !== "") {
          let tierArray = [];
          let buildTypesArray = Array.from(tierBuildTypes.get(tierName));
          tierData.forEach((weaponArray, weaponName) => {
            tierArray.push({
              "Weapon Name": weaponName,
              "Build Type": weaponArray[0]["Build Type"],
              data: weaponArray,
            });
          });
    
          mainArray.push({
            Tier: tierName,
            BuildTypes: buildTypesArray,
            data: tierArray,
          });
        }
      });
    return mainArray; // This will return the rows from the sheet as an array
};

app.get("/", async (req, res) => {
    try {
        const data = await getDataFromSheet();
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
