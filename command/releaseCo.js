const { Shell, resolveJson } = require('../lib/utils');
const process = require('process');
const ora = require('ora');

const rootPath = process.cwd();
const axios = require('axios');

async function releaseComponents({ webDomian, nameSpace, gitUrl, name, baseApi }) {
  const spinner = ora('🗃 开始上传组件...').start();

  const sh = new Shell();
  const componentConfig = require(`${process.cwd()}/coco.config.js`);
  const config = {
    ...componentConfig,
    config: []
  };
  // 查找 packages 下所有文件
  sh.shell.ls('packages').forEach((file) => {
    if (file.indexOf('.') === -1) {
      const json = resolveJson(`${rootPath}/packages/${file}`);
      if (!json.name || !json.version || !json.description) {
        console.error(`${rootPath}/packages/${file} 存在不合规范的package.json, 必须包含name、version、description属性`);
        process.exit(0);
      }
      // 组件发布按照 组件名+组件版本 的形式进行发布，比如 coco-global-banner.0.0.1.umd.js
      const name = `${json.name}.${json.version}`;
      config.config.push({
        dir: file,
        snapshot: json.snapshot,
        name,
        description: json.description,
        js: `${componentConfig.webDomian}/${json.name}/${name}.umd.js`,
        css: `${componentConfig.webDomian}/${json.name}/${name}.css`
      });
    }
  });
  try {
    const res = await axios.get(`${baseApi}/component/query`, {
      params: { gitUrl }
    });
    config.config = JSON.stringify(config.config);
    const hasRecord = !!res.data.result[0];
    if (!hasRecord) {
      const res = await axios.post(`${baseApi}/component/add`, config);
      if (res.data.showType !== undefined) {
        console.log('上传失败' + res.data.result.message);
        return;
      }
      console.log('上传成功');
    } else {
      await axios.post(`${baseApi}/component/update`, config);
      console.log('组件已存在，上传成功');
    }
    spinner.succeed('🎉 组件上传完成');
  } catch (e) {
    process.exit(0);
    console.log('上传失败' + e);
  }
}

async function releaseCo() {
  const baseApi = 'http://localhost:7001';
  await releaseComponents({baseApi});
}

module.exports = releaseCo;
