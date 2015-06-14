module.exports = function(grunt) {

  //build process
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  //reset build directory
  grunt.loadNpmTasks('grunt-contrib-clean');
  //task automation
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  //linting
  grunt.loadNpmTasks('grunt-contrib-jshint');
  //might need to add grunt-concurrent to run nodemon and watch simulatneously in one tab

  grunt.initConfig({
    //main build process
    webpack: {
      client: {
        entry: __dirname + '/app/js/client.js',
        output: {
          path: 'build/',
          file: 'bundle.js'
        }
      },
      //front-end tests build process
      karma_test: {
        entry: __dirname + '/app/test/karma_tests/test_entry.js',
        output: {
          path: 'app/test/karma_tests/build/',
          file: 'bundle.js'
        }
      }
    },
    //converts sass/scss to css
    sass: {
      dist: {
        files: {
          'app/stylesheet/application.css': 'app/stylesheet/scss/application.scss'
        }
      }
    },
    //copies static files to build directory
    copy: {
      html: {
        cwd: 'app/',
        expand: true,
        flatten: false,
        src: '**/*.html',
        dest: 'build/',
        filter: 'isFile'
      },

      css: {
        cwd: 'app/',
        expand: true,
        flatten: true,
        src: 'stylesheet/application.css',
        dest: 'build/',
        filter: 'isFile'

      }
    },
    //resets build directory
    clean: {
      dev: {
        src: ['build/', 'app/test/karma_tests/build/']
      }
    },
    //linting
    jshint: {
      options: {
        node: true
      },
      //linting client side tests
      jasmine: {
        src: ['app/test/karma_tests/*test.js'],
        options: {
          globals: {
            angular: true,
            describe: true,
            it: true,
            before: true,
            beforeEach: true,
            after: true,
            afterEach: true,
            expect: true
          }
        }
      },
      //linting server side tests
      mocha: {
        src: ['backend/test/server/*test.js'],
        options: {
          globals: {
            describe: true,
            it: true,
            before: true,
            beforeEach: true,
            after: true,
            afterEach: true
          }
        }
      },
      //linting client side
      client: {
        src: ['app/**/*.js'],
        options: {
          globals: {
            angular: true
          }
        }
      },
      //linting server side
      server: {
        src: ['Gruntfile.js', 'server.js', 'backend/models/**/*.js', 'routes/**/*.js']
      }
    },

    //task automation
    watch: {
      files: [],
      js: {
        files: ['app/**/*.js'],
        tasks: ['build'],
        options: {
          livereload: true
        }
      },
      html: {
        files: ['app/**/*.html'],
        tasks: ['copy:html'],
        options: {
          livereload: true
        }
      },
      css: {
        files: ['app/**/*.scss'],
        tasks: ['sass', 'copy:css'],
        options: {
          livereload: true
        }
      }
    },
    //not sure if/how this works. check with Stefan
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          watch: ['backend/']
        }
      }
    }
  });

  grunt.registerTask('build:dev', ['webpack:client', 'copy:html', 'copy:css']);
  grunt.registerTask('build:test', ['webpack:karma_test']);
  grunt.registerTask('build', ['build:dev', 'build:test']);
  grunt.registerTask('linter', ['jshint']);
};
