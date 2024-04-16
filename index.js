const express = require("express");
const { google } = require("googleapis");
const fs = require("fs");
const app = express();

app.use(express.json()); // To support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // To support URL-encoded bodies

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

    return response.data.values; // This will return the rows from the sheet as an array
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
