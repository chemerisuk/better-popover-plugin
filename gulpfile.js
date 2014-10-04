var gulp = require("gulp");
var gulpif = require("gulp-if");
var jshint = require("gulp-jshint");
var karma = require("karma").server;
var karmaConfig = require.resolve("./test/karma.conf");

gulp.task("lint", function() {
    return gulp.src(["src/*.js", "test/**/*.js", "*.js"])
        .pipe(jshint(".jshintrc"))
        .pipe(jshint.reporter("jshint-stylish"))
        .pipe(gulpif(process.env.TRAVIS_JOB_NUMBER, jshint.reporter("fail")));
});

gulp.task("test", ["lint"], function(done) {
    var config = { configFile: karmaConfig };

    if (process.env.TRAVIS_JOB_NUMBER) {
        config = {
            configFile: karmaConfig,
            preprocessors: { "src/better-popover.js": "coverage" },
            reporters: ["coverage", "dots", "coveralls"],
            coverageReporter: {
                type: "lcovonly",
                dir: "coverage/"
            }
        };
    }

    karma.start(config, done);
});

gulp.task("dev", function() {
    gulp.watch(["src/*.js", "test/**/*.js", "*.js"], ["lint"]);

    karma.start({
        configFile: karmaConfig,
        preprocessors: { "src/better-popover.js": "coverage" },
        reporters: ["coverage", "progress"],
        background: true,
        singleRun: false
    });
});
