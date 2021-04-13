const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');
const readPkg = require('read-pkg');
const { execSync } = require('child_process');
const sh = require('shelljs');

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

class Shell {
  constructor() {
    this.shell = sh;
  }
  exec(command) {
    return new Promise((resolve, reject) => {
      sh.exec(
        command,
        {
          async: true
        },
        (code, stdout, stderr) => {
          stdout = stdout.toString().trim();
          if (code === 0) {
            if (stderr) {
              console.error(stderr.toString().trim());
            }
            resolve(stdout);
          } else {
            if (stdout && stderr) {
              console.error(`\n${stdout}`);
            }
            reject(new Error(stderr || stdout));
          }
        }
      );
    });
  }
}

module.exports = {
  writeFileTree,
  resolveJson,
  pusBranch,
  Shell,
}
