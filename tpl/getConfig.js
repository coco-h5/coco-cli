module.exports = function ({
   name,
   templateName,
   author,
   projectType,
   nameSpace,
   repoUrl
 }) {
  return `module.exports = {
    name: '${name}',
    templateName: '${templateName}',
    author: '${author}',
    snapshot: '',
    gitUrl: '${repoUrl}',
    projectType: '${projectType}',
    nameSpace: '${nameSpace}'
  }`
}
