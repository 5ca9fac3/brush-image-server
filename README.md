### Instructions

run npm install

start redis server

start mongo database server

run npm install -g redis-commander (optional)

run npm start

## OR

install docker

install docker-compose

run docker-compose up

### Instructions

1. In the current folder go to the thingsToSeed.js file, this file contains all the zones and asset types available to seed
   - update the `layoutsToCreate` variable value to be the zones that need to be seeded or keep it empty array to seed all the available zones
   - update the `assetTypesToCreate` variable value to be the asset types that need to be seeded or keep it empty array to seed all the available asset types

example:

```javascript
const layoutsToCreate = [zonesMap.Office, zonesMap.Hospital, zonesMap.ConstructionSite];
const assetTypesToCreate = [
  assetTypeMap.OfficeEmployee,
  assetTypeMap.TruckGPS,
  assetTypeMap.FormworkPlates,
  assetTypeMap.Nurse
];
```

### Running the Script _(use one option based on the requirement)_

- If running the script for the 1st time or if you want to seed all the zones , asset types and asset images available afresh

```bash
./demoSeedScript.sh
```

- If running the script on an already existing database, and only want to add new zones/asset types and updating asset images on top of the existing ones

```bash
./demoSeedScript.sh --skip-initial-seed
```
