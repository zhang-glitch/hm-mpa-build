#!/usr/bin/env node

// cli入口
// 赋值脚本执行时的参数
// 指定教本执行的工作目录，将其指向项目运行目录。
process.argv.push('--cwd')
process.argv.push(process.cwd())
// 将gulp配置文件指向当前构建工具的入口文件
process.argv.push('--gulpfile')
process.argv.push(require.resolve('..'))

// 执行gulp的脚手架
require('gulp/bin/gulp')
