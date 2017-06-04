const run = require('./utils/run-cli-cmd.js')
const fs = require('fs')
const UglifyJS = require('uglify-js')
const packageInfo = require('../../package.json')
const preamble = require('../build/preamble.js')

// TODO: replace custom task runner with GULP 4

// configs
const distName = `base-query-${packageInfo.version}`
const deployTargetDir = `code.archilogic.com`

run([
  // build
  `npm run build`,
  // empty distribution folder
  //'rm -f dist/*',
  // copy build files to distribution folder
  `cp build/base-query.js dist/${distName}.js`,
  `cp build/base-query.js.map dist/${distName}.js.map`,
  // uglify
  () => {
    const ugly = UglifyJS.minify(read(`dist/${distName}.js`), {
      warnings: true, mangle: true, ie8: false,
      compress: {dead_code: true, toplevel: true, passes: 3},
      output: {preamble: preamble, beautify: false},
      sourceMap: {content: read(`dist/${distName}.js.map`), url: `${distName}.min.js.map`}
    })
    if (ugly.warnings) console.log('UGLIFY WARNINGS: ', ugly.warnings)
    if (ugly.error) return Promise.reject(ugly.error)
    fs.writeFileSync(`dist/${distName}.min.js`, ugly.code)
    fs.writeFileSync(`dist/${distName}.min.js.map`, ugly.map)
  },
  // gzip uglified files
  `gzip -9 dist/${distName}.min.js dist/${distName}.min.js.map`,
  // remove .gz extension
  `mv dist/${distName}.min.js.gz dist/${distName}.min.js`,
  `mv dist/${distName}.min.js.map.gz dist/${distName}.min.js.map`,
  // deploy to S3
  `aws s3 cp ./dist/${distName}.js s3://${deployTargetDir}/${distName}.js`,
  `aws s3 cp ./dist/${distName}.js.map s3://${deployTargetDir}/${distName}.js.map`,
  `aws s3 cp --content-encoding=gzip ./dist/${distName}.min.js s3://${deployTargetDir}/${distName}.min.js`,
  `aws s3 cp --content-encoding=gzip ./dist/${distName}.min.js.map s3://${deployTargetDir}/${distName}.min.js.map`
]).catch(console.error)

// helpers

function read (path) {
  return fs.readFileSync(path, `utf8`)
}