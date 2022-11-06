const fs = require('fs');
const path = require('path');

let directoryPath = path.join(__dirname, 'secret-folder');

fs.readdir(directoryPath, {withFileTypes: true}, (err, files) => {
  if (err) {console.log(err.message)}
  files.forEach(file => {
    if (file.isFile()) {
      fs.stat(path.join(__dirname, 'secret-folder', file.name), (err, stat) => {
        if (err) {console.log(err.message)}
        console.log('File info:');
        console.log(`${file.name.split('.')[0]} - ${file.name.split('.')[1]} - ${stat.size/1000}kb`)
      })
    }
  })
});
