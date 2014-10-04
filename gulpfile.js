var gulp = require("gulp");
var gulpif = require("gulp-if");
var jshint = require("gulp-jshint");
var header = require("gulp-header");
var pkg = require("./package.json");
var argv = require("yargs").argv;
var bump = require("gulp-bump");
var git = require("gulp-git");
var filter = require("gulp-filter");
var tag_version = require("gulp-tag-version");

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
            preprocessors: { "src/*.js": "coverage" },
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
        preprocessors: { "src/*.js": "coverage" },
        reporters: ["coverage", "progress"],
        background: true,
        singleRun: false
    });
});

gulp.task("bump", function() {
    var version = argv.tag;

    if (!version) throw new gutil.PluginError("release", "You need to specify --tag parameter");

    return gulp.src(["./*.json"])
        .pipe(bump({version: version}))
        .pipe(gulp.dest("./"));
});

gulp.task("dist", ["bump"], function() {
    var banner = [
        "/**",
        " * <%= pkg.name %>: <%= pkg.description %>",
        " * @version <%= version %> <%= new Date().toUTCString() %>",
        " * @link <%= pkg.homepage %>",
        " * @copyright 2014 <%= pkg.author %>",
        " * @license <%= pkg.license %>",
        " */"
    ].join("\n");

    return gulp.src("src/*.js")
        .pipe(header(banner + "\n", { pkg: pkg, version: argv.tag }))
        .pipe(gulp.dest("dist/"));
});

gulp.task("release", ["dist"], function() {
    gulp.src(["./*.json", "./dist/*.js"])
        .pipe(git.commit("version " + argv.tag))
        .pipe(filter("package.json"))
        .pipe(tag_version());
});
