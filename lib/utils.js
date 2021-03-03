const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');
const readPkg = require('read-pkg');
const { execSync } = require('child_process');

function writeFileTree (dir, files) {
  Object.keys(files).forEach((name) => {
    const filePath = path.join(dir, name)
    fsExtra.ensureDirSync(path.dirname(filePath))
    fsExtra.writeFileSync(filePath, files[name])
  })
}


function resolveJson (context, name = 'package.json') {
  if (fs.existsSync(path.join(context, name))) {
    return readPkg.sync({
      cwd: context
    })
  }
  return {}
}

function pusBranch() {
  try {
    execSync(`git add . && git commit -m 'release project' && git push`);
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  writeFileTree,
  resolveJson,
  pusBranch,
}