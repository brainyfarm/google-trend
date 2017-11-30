const json2csv = require('json2csv');
const fs = require('fs');
module.exports = (data, fields, filename, frame) => {
    return new Promise((resolve, reject) => {
        const csvContent = json2csv({ data, fields });
        return fs.writeFile(`./csv/${filename}-${frame.toLowerCase()}.csv`, csvContent, function(err) {
            if (err) reject(err);
            resolve('File Saved');
          });
    });
}