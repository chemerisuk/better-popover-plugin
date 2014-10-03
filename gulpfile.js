var gulp = require("gulp");
var jshint = require("gulp-jshint");
var karma = require("karma").server;
var karmaConfig = require.resolve("./test/karma.conf");

gulp.task("lint", function() {
    return gulp.src(["src/*.js", "test/**/*.js", "*.js"])
        .pipe(jshint(".jshintrc"))
        .pipe(jshint.reporter("jshint-stylish"))
        .pipe(jshint.reporter("fail"));
});

gulp.task("test", ["lint"], function(done) {
    karma.start({
        configFile: karmaConfig
    }, done);
});

gulp.task("dev", function() {
    karma.start({
        configFile: karmaConfig,
        preprocessors: { "src/better-popover.js": "coverage" },
        reporters: ["coverage", "progress"],
        background: true,
        singleRun: false
    });
});

gulp.task("travis", ["lint"], function(done) {
    karma.start({
        configFile: karmaConfig,
        preprocessors: { "build/better-popover.js": "coverage" },
        reporters: ["coverage", "dots", "coveralls"],
        coverageReporter: {
            type: "lcovonly",
            dir: "coverage/"
        }
    }, done);
});
