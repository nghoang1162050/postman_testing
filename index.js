const newman = require('newman');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const moment = require('moment');

// Correct postman files
const collectionFile = './postman_json/smart_parking_testing.postman_collection.json';
const environment = './postman_json/smart_parking_test.postman_environment.json';

// default folder
const currentDate = moment().format('YYYYMMDD');
const outputDir = `./reports/${currentDate}`;
const summaryFile = `${outputDir}/summary.xlsx`;
const testCaseDir = './postman_test_case';

// Create reports directory if not exists
if (!fs.existsSync('./reports')) {
    fs.mkdirSync('./reports');
}

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const getFolders = () => {
    // Read and parse the collection file
    const collection = JSON.parse(fs.readFileSync(collectionFile));

    // Extract all items from the collection
    const items = collection.item.flatMap(folder =>
        folder.item.flatMap(sub =>
            sub.item.map(s => s.name)
        )
    );

    return items;
}

const FOLDERS = getFolders();

const generateSummary = (folderSummaries) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Summary');

    worksheet.columns = [
        { header: 'Folder', key: 'folder' },
        { header: 'Total Requests', key: 'totalRequests' },
        { header: 'Execution Time (ms)', key: 'executionTime' },
        { header: 'Timestamp', key: 'timestamp' },
        { header: 'Passed', key: 'passed' }
    ];

    folderSummaries.forEach(summary => {
        worksheet.addRow(summary);
    });

    // Apply conditional formatting
    worksheet.eachRow((row, rowNumber) => {
        const passedCell = row.getCell('passed');
        if (passedCell.value === 'No') {
            passedCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF0000' } // Red color
            };
        }
    });

    return workbook.xlsx.writeFile(`${summaryFile}`);
};

const executeTests = async () => {
    let folderSummaries = [];

    for (let folder of FOLDERS) {
        await new Promise((resolve, reject) => {
            newman.run({
                collection: collectionFile,
                folder: folder,
                environment: environment,
                iterationData: `${testCaseDir}/${folder}.json`,
                reporters: ['htmlextra'],
                reporter: {
                    htmlextra: {
                        export: path.join(outputDir, `${folder}.html`),
                        browserTitle: `${folder}`,
                        title: `${folder}`,
                        // displayProgressBar: true
                    }
                }
            }, (err, summary) => {
                if (err) {
                    console.error(`Error running folder ${folder}:`, err);
                    return reject(err);
                }

                const execSummary = summary.run.executions.reduce((acc, exec) => {
                    acc.totalRequests++;
                    const allAssertionsPassed = exec.assertions.every(assert => !assert.error);
                    if (allAssertionsPassed) {
                        acc.passedRequests++;
                    }
                    return acc;
                }, { totalRequests: 0, passedRequests: 0 });

                const summaryData = {
                    folder: folder,
                    totalRequests: execSummary.totalRequests,
                    executionTime: summary.run.timings.completed - summary.run.timings.started,
                    timestamp: new Date().toISOString().split('T')[0].replace(/-/g, ''),
                    passed: execSummary.totalRequests === execSummary.passedRequests ? 'Yes' : 'No'
                };

                folderSummaries.push(summaryData);
                resolve();
            });
        });
    }

    await generateSummary(folderSummaries);
    console.log(`Summary file generated at ${summaryFile}`);
};

executeTests();
