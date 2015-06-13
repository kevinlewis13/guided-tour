module.exports = function(grunt) {

  //build process
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-copy');
  //reset build directory
  grunt.loadNpmTasks('grunt-contrib-clean');
  //task automation
  grunt.loadNpmTasks('grunt-contrib-watch');
  //linting
  grunt.loadNpmTasks('grunt-contrib-jshint');
  //testing
  //TO FOLLOW

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
          path: '/app/test/karma_tests/build/',
          file: 'bundle.js'
        }
      }
    },

    copy: {
      html: {
        cwd: 'app/',
        expand: true,
        flatten: false,
        src: '**/*.html',
        dest: 'build/',
        filter: 'isFile'
      }
    },
    //reset build directory
    clean: {
      dev: {
        src: 'build/'
      }
    }

    //task automation

    //linting

    //testing

  });

  grunt.registerTask('build:dev', ['webpack:client', 'copy:html']);
  grunt.registerTask('build:test', ['webpack:karma_test']);
  grunt.registerTask('build', ['build:dev', 'build:test']);


};
