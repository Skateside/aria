const gulp              = require("gulp");
const babel             = require("gulp-babel");
const mochaPhantomJS    = require("gulp-mocha-phantomjs");

// TODO: populate ARIA.VERSION from package.json

gulp.task("test", function () {

    // PhantomJS Doesn't understand ES6 so transpile before testing.
    // TODO: polyfill Set() to allow PhantomJS to test window.ARIA
    // gulp.src("./aria.js")
    //     .pipe(babel({
    //         presets: ["env"]
    //     }))
    //     .pipe(gulp.dest("./tests"));

    gulp.src("./tests/testrunner.html")
        .pipe(mochaPhantomJS({
            globals: ["window", "ARIA"],
            reporter: "spec",
            phantomjs: {
                useColors: true
            }
        }));

});

gulp.task("watch", function () {

    gulp.watch(["./tests/**/*.js"], ["test"]);

});
