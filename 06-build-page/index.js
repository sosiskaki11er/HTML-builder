const fs = require('fs');
const path = require('path');

let directoryPath = path.join(__dirname, 'project-dist');
let componentsPath = path.join(__dirname, 'components');
let stylesPath = path.join(__dirname, 'styles');

let indexFile = path.join(directoryPath, 'index.html');
const indexOutput = fs.createWriteStream(indexFile);
indexOutput.write('');

let stylesFile = path.join(directoryPath, 'style.css');
const stylesOutput = fs.createWriteStream(stylesFile);
stylesOutput.write('');

let assetsPath = path.join(__dirname, 'assets');
let newAssetsPath = path.join(directoryPath, 'assets');

async function makeFolder() {
  fs.mkdir(directoryPath, { recursive: true }, (err) => {
    if (err) {console.log(err.message)}
  });
};

async function readTemplate() {
  let data = await fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf-8')
  return data;
}

async function readComponents() {
  let components = {};
  let files = await fs.promises.readdir(componentsPath, {withFileTypes: true});
  for (let file of files) {
    let fileContent = await fs.promises.readFile(path.join(componentsPath, file.name), 'utf-8');
    components[path.parse(file.name).name] = fileContent;
  }
  return components;
}

function fillComponents() {
  Object.keys(components).forEach(component => {
    indexFileContent = indexFileContent.replace(`{{${component}}}`, components[component]);
  });
}

async function writeIndex() {
  indexOutput.write(indexFileContent);
}

async function createStylesFile() {
  let stylesFileContent = '';
  let files = await fs.promises.readdir(stylesPath, {withFileTypes: true})
  for (let file of files) {
    if (file.isFile() && path.extname(path.join(stylesPath, file.name)) === '.css') {
      let fileContent = await fs.promises.readFile(path.join(stylesPath, file.name), 'utf-8');
      stylesFileContent += fileContent;
    }
  }
  return stylesFileContent;
}

async function writeStyles() {
  stylesOutput.write(stylesFileContent);
}

async function makeAssetsFolder(newAssetsPath){
  await fs.promises.rm(newAssetsPath, { recursive: true, force: true });
  await fs.promises.mkdir(newAssetsPath, { recursive: true });
}

async function copyAssets(assetsPath, newAssetsPath){
  let files = await fs.promises.readdir(assetsPath, {withFileTypes: true})
  for (let file of files) {
    if (file.isDirectory()) {
      let OldFolder = path.join(assetsPath, file.name);
      let newFolder = path.join(newAssetsPath, file.name);
      await fs.promises.mkdir(newFolder, { recursive: true });
      await copyAssets(OldFolder, newFolder)
    }
    else {
      let sourceFile = path.join(assetsPath, file.name);
      let destFile = path.join(newAssetsPath, file.name);
      await fs.promises.copyFile(sourceFile, destFile);
    }
  }
}

let indexFileContent = '';
let stylesFileContent = '';
let components = {};

async function createPage() {
  await makeFolder();
  indexFileContent = await readTemplate();
  components = await readComponents();
  fillComponents();
  await writeIndex();
  stylesFileContent = await createStylesFile();
  await writeStyles();
  await makeAssetsFolder(newAssetsPath);
  await copyAssets(assetsPath, newAssetsPath);
}
createPage()
