const { src, dest, watch, parallel } = require("gulp");

//CSS
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");

//JavaScript
const terser = require("gulp-terser-js");

//Images
const imagemin = require("gulp-imagemin");
const cache = require("gulp-cache");
const webp = require("gulp-webp");
const avif = require("gulp-avif");

function dev(cb) {
    watch("src/sass/**/*.sass", css);
    watch("src/js/**/*.js", javaScript);

    cb();
}

function css(cb) {
    //SASS archive
    //compile
    //storage
    src("src/sass/**/*.sass")
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write("."))
        .pipe(dest("build/css"));
    cb();
}

function imagesmin(cb) {
    const options = {
        optimizationLevel: 3,
    }
    src("src/img/**/*.{png,jpg}")
        .pipe(cache(imagemin(options)))
        .pipe(dest("build/img"));
    cb();
}

function convertToWebp(cb) {
    const options = {
        quality: 70
    }
    src("src/img/**/*.{png,jpg}")
        .pipe(webp(options))
        .pipe(dest("build/img"))
    cb();
}
function convertToAvif(cb) {
    const options = {
        quality: 70
    }
    src("src/img/**/*.{png,jpg}")
        .pipe(avif(options))
        .pipe(dest("build/img"))
    cb();
}

function javaScript(cb) {
    src("src/js/**/*.js")
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write("."))
        .pipe(dest("build/js"));
    cb();
} 



exports.convertToWebp = convertToWebp;
exports.imagesmin = imagesmin;
exports.convertToAvif = convertToAvif;
exports.js = javaScript;
exports.dev = parallel(imagesmin, convertToAvif, convertToWebp, javaScript, dev);