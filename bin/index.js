#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const program = require('commander');
const initial = require('../command/initial');
const generate = require('../command/generator');

let config = {};
// 配置文件如果存在则读取
if(fs.existsSync(path.resolve('coco.config.js'))){
  config = require(path.resolve('coco.config.js'));
}

program
  .version('1.0.0','-v, --version')
  .command('init')
  .description('初始化 coco config 配置文件')
  .action(initial);

program
  .command('create [template]')
  .description('generator a new template')
  .action(function(template){
    generate(template);
  });

program.parse(process.argv);