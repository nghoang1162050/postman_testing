const fs = require('fs');

const collectionFile = './postman_json/smart_parking_testing.postman_collection.json';

const makeFolders = (parentFolder) => {
    if (!fs.existsSync(parentFolder)) {
        fs.mkdirSync(parentFolder);
    }

    // Read and parse the collection file
    const collection = JSON.parse(fs.readFileSync(collectionFile));

    // Extract all items from the collection
    const items = collection.item.flatMap(folder =>
        folder.item.flatMap(sub =>
            sub.item.map(s => s.name)
        )
    );

    items.forEach(item => {
        const jsonData = JSON.stringify([item], null, 2);
        fs.writeFile(`${parentFolder}/${item}.json`, jsonData, (err) => {
            if (err) {
                console.error(`Error writing file ${item}.json`, err);
            } else {
                console.log(`File ${item}.json has been written`);
            }
        });
    });
}

makeFolders("postman_test_case");
