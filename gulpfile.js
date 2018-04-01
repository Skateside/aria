const gulp              = require("gulp");
const babel             = require("gulp-babel");
const mochaPhantomJS    = require("gulp-mocha-phantomjs");
const concat            = require("gulp-concat-util");
const minify            = require("gulp-minify");
const sourcemaps        = require("gulp-sourcemaps");
const fs                = require("fs");
const pkgJson           = JSON.parse(fs.readFileSync("./package.json"))
// const docdown           = require("gulp-docdown");
const rename            = require("gulp-rename");
// const runSequence       = require("run-sequence");

const getToday = function () {

    let date = new Date();

    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

};



gulp.task("test", function () {

    gulp.src("./tests/testrunner.html")
        .pipe(mochaPhantomJS({
            globals: ["window", "ARIA"],
            reporter: "spec",
            phantomjs: {
                useColors: true
            }
        }));

});

gulp.task("js", function () {

    gulp.src([
            "src/core.js",
            "src/util.js",
            "src/aria.js",
            "src/role.js",
            "src/focus.js",
            "src/chain.js",
            "src/events.js"
        ])
        .pipe(concat("aria.js", {
            process: function (source) {

                return (
                    source
                        .replace(/\(function \([\w]+\) \{/, "")
                        .replace(/(["'])use strict\1;?\s*/g, "")
                        .replace(/\}\([\w\.]+\)\);/, "")
                        .replace(/<%=\s*(\w+)\s*%>/g, function (ignore, k) {

                            return typeof pkgJson[k] === "string"
                                ? pkgJson[k]
                                : k;

                        })
                );

            }
        }))
        .pipe(concat.header(
            `/*! ${pkgJson.name} - ` +
            `v${pkgJson.version} - ${pkgJson.license} license - ` +
            `${getToday()} */\n` +
            `(function (globalVariable) {\n` +
            `    "use strict";\n\n`

        ))
        .pipe(concat.footer('}(window));'))
        .pipe(gulp.dest("./dist/"))
        .pipe(sourcemaps.init())
        .pipe(minify({
            ext: {
                min: ".min.js"
            },
            preserveComments: function (node, comment) {
                return comment.value.startsWith("!");
            }
        }))
        .pipe(sourcemaps.write("./", {
            sourceMappingURL: function (file) {
                return file.relative + ".map";
            }
        }))
        .pipe(gulp.dest("./dist/"));

});

gulp.task("transpile", ["js"], function () {

    // PhantomJS Doesn't understand ES6 so transpile before testing.
    // TODO: polyfill Set() to allow PhantomJS to test window.ARIA
    gulp.src("./dist/aria.js")
        .pipe(babel({
            presets: ["env"]
        }))
        .pipe(rename({
            extname: ".es5.js"
        }))
        .pipe(gulp.dest("./dist"))
        .pipe(sourcemaps.init())
        .pipe(minify({
            ext: {
                min: ".min.js"
            },
            preserveComments: function (node, comment) {
                return comment.value.startsWith("!");
            }
        }))
        .pipe(sourcemaps.write("./", {
            sourceMappingURL: function (file) {
                return file.relative + ".map";
            }
        }))
        .pipe(gulp.dest("./dist/"));


});

// gulp.task("docdown", function () {
//
//     gulp.src("./dist/aria.es5.js")
//         .pipe(docdown({
//             title: "WAI-ARIA JS",
//             url: "https://github.com/Skateside/aria/tree/master/dist/{filePath}",
//             toc: "categories",
//             outputType: "html"
//         }))
//         .pipe(rename({
//             extname: ".html"
//         }))
//         .pipe(gulp.dest("./doc"));
//
// });

gulp.task("watch", function () {

    gulp.watch(["./tests/**/*.js"], ["test"]);
    gulp.watch(["./src/**/*.js"], ["js"]);

});

// gulp.task("doc", function (done) {
//
//     runSequence("transpile", "docdown", function () {
//         done();
//     });
//
// });

gulp.task("default", ["watch"]);
