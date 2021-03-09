const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');

function copyCocoConfigJS(){
  figlet('coco cli', function(err, data) {
    if(err){
      console.log(chalk.red('Some thing about figlet is wrong!'));
    }
    console.log(chalk.yellow(data));
    let targetFilePath = path.resolve('coco.config.js');
    let templatePath = path.join(__dirname,'../tpl/coco.config.js');
    let contents = fs.readFileSync(templatePath,'utf8');
    fs.writeFileSync(targetFilePath,contents,'utf8');
    console.log(chalk.green('初始化配置成功 \n'));
    process.exit(0);
  });
}

module.exports = function(){
  // 配置文件如果存在则提示是否覆盖
  if(fs.existsSync(path.resolve('coco.config.js'))){
    // 连续提问
    inquirer.prompt([
      {
        name:'init-confirm',
        type:'confirm',
        message:`coco.config.js 已经存在，是否覆盖?`,
        validate: function(input){
          if(input.lowerCase !== 'y' && input.lowerCase !== 'n' ){
            return 'Please input y/n !'
          }
          else{
            return true;
          }
        }
      }
    ])
      .then(answers=>{
        if(answers['init-confirm']){
          copyCocoConfigJS();
        }
        else{
          process.exit(0);
        }
      })
      .catch(err=>{
        console.log(chalk.red(err));
      })
  }
  else{
    copyCocoConfigJS();
  }
};

