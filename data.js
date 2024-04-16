const fs = require("fs");
const data = require("./data.json");
const path = require("path");

const aray = [];

const pathDir = path.join(__dirname, "")

exports.dataStructured = () => {
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

  console.log("data FILE IS RUNNING");

  fs.writeFile(
    `${pathDir}/array.json`,
    JSON.stringify(mainArray),
    (err) => {
      if (err) throw err;
      console.log("Data written to aray.json");
    }
  );
}
