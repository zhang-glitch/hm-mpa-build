const {src, dest, parallel, series, watch} = require("gulp")

const sass = require('gulp-sass')(require('sass'));

const del = require("del")

const plugins = require("gulp-load-plugins")()

const browserSync = require("browser-sync")

const bs = browserSync.create()

const cwd = process.cwd()

let config = {
   // default config
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
  }
}

try {
  const buildConfig = require(`${cwd}/build.config.js`)
  config = Object.assign({}, config, buildConfig)
} catch (error) {

}

const style = () => {

  return src(config.build.paths.styles, {base: config.build.src, cwd: config.build.src}).pipe(sass()).pipe(dest(config.build.temp)).pipe(bs.reload({stream: true}))
}

const script = () => {
  return src(config.build.paths.scripts, {base: config.build.src, cwd: config.build.src}).pipe(plugins.babel({presets: [require("@babel/preset-env")]})).pipe(dest(config.build.temp)).pipe(bs.reload({stream: true}))
}

const page = () => {

  return src(config.build.paths.pages, {base: config.build.src, cwd: config.build.src}).pipe(plugins.swig({data: config.data, defaults: {
    cache: false}})).pipe(dest(config.build.temp)).pipe(bs.reload({stream: true}))
}


const image = () => {
  return src(config.build.paths.images, {base: config.build.src, cwd: config.build.src}).pipe(plugins.imagemin()).pipe(dest(config.build.dist))
}

const font = () => {
  return src(config.build.paths.fonts, {base: config.build.src, cwd: config.build.src}).pipe(plugins.imagemin()).pipe(dest(config.build.dist))
}

const extra = () => {
  return src(config.build.public + "/**", {base: config.build.public}).pipe(dest("dist"))
}

const clean = () => {
  return del([config.build.dist, config.build.temp])
}

const server = () => {
  watch(config.build.paths.styles, { cwd: config.build.src }, style)
  watch(config.build.paths.scripts, { cwd: config.build.src }, script)
  watch(config.build.paths.pages, { cwd: config.build.src }, page)


  watch([
    config.build.paths.images,
    config.build.paths.fonts
  ], { cwd: config.build.src }, bs.reload)

  watch('**', { cwd: config.build.public }, bs.reload)
  bs.init({
    notify: false,
    // files: "dist/**",
    server: {
      baseDir: [config.build.temp, config.build.src, config.build.public],
      routes: {
        "/node_modules": "node_modules"
      }
    }
  })
}


const useref = () => {
  return src(config.build.paths.pages, { base: config.build.temp, cwd: config.build.temp })
  .pipe(plugins.useref({ searchPath: [config.build.temp, '.'] }))
  .pipe(plugins.if(/\.js$/, plugins.uglify()))
  .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
  .pipe(plugins.if(/\.html$/, plugins.htmlmin({
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true
  })))
  .pipe(dest(config.build.dist))
}


const compile = parallel(style, script, page)

const build = series(clean, parallel(series(compile, useref), image, font, extra))

const dev = series(clean, compile, server)

module.exports = {
  build,
  compile,
  dev
}
