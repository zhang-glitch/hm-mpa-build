## hm-mpa-build

一个基于gulp的构建工具。

为了提供更好的扩展性，约定大于配置。我们希望用户在项目的根目录下创建一个`build.config.js`文件作为该构建工具的配置文件。

## usage

我们可以提供类似于这种配置。
```js
build: {
  src: 'src',
  dist: 'dist',
  temp: 'temp',
  public: 'public',
  paths: {
    styles: 'assets/styles/*.scss',
    scripts: 'assets/scripts/*.js',
    pages: '*.html',
    images: 'assets/images/**',
    fonts: 'assets/fonts/**'
  }
},
data: {

}
```
我们可以使用该构建工具的一些命令，为我们构建项目。
```js
"scripts": {
  // 清除打包
  "clean": "hm-mpa-build clean",
  // 打包
  "build": "hm-mpa-build build",
  // 运行项目预览
  "dev": "hm-mpa-build dev"
},
```
## 一些项目介绍
### bin/index.js
cli入口文件。

我们可以将gulp封装到该构建工具里，不需要外界再去安装gulp工具，直接通过配置一些命令就可以实现，然后项目使用直接通过我们构建工具的脚手架来执行构建操作即可。
```js
// 赋值脚本执行时的参数
// 指定教本执行的工作目录，将其指向项目运行目录。
process.argv.push('--cwd')
process.argv.push(process.cwd())
// 将gulp配置文件指向当前构建工具的入口文件
process.argv.push('--gulpfile')
process.argv.push(require.resolve('..'))

// 执行gulp的脚手架
require('gulp/bin/gulp')
```
### 对于发布包的介绍
默认情况下，我们项目下的文件都会被发布出去，如果想要一些文件夹发布，我们需要在package.json中配置files属性指定哪些文件夹需要被发布。

package.json中的main指定项目的入口文件，bin指定项目脚手架的入口文件。
