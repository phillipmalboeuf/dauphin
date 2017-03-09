module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    bgShell: {
      install: {
        cmd: 'pyvenv-3.5 '+ __dirname +'/environment && source '+ __dirname +'/environment/bin/activate && pip install -r requirements.txt',
        bg: false,
        stdout: false
      },
      server: {
        cmd: 'source '+ __dirname +'/environment/bin/activate && python server.py',
        bg: false,
        stdout: false
      },
      development: {
        cmd: "node_modules/.bin/webpack-dev-server --config=./config/development.js",
        bg: true
      },
      build: {
        cmd: "node_modules/.bin/webpack --config=./config/production.js --progress -p",
        bg: false,
        stdout: false
      }
    },

    sass: {
      compile: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
            'build/all.css': 'core/styles/all.scss',
        }
      }
    },

    open: {
      start: {
        path: 'http://localhost:8080',
        app: 'Google Chrome'
      }
    },

    watch: {
      options: {
        livereload: {
          host: 'localhost',
          port: 9000
        }
      },
      html: {
        files: ['core/templates/**/*.html']
      },
      javascript: {
        options: {
          livereload: false
        },
        files: ['core/scripts/**/*.js'],
        tasks: ['bgShell:build']
      },
      sass: {
        options: {
          livereload: false
        },
        files: ['core/styles/**/*.scss'],
        tasks: ['sass']
      },
      css: {
        files: 'build/all.css'
      }
    }


  });


  grunt.loadNpmTasks('grunt-bg-shell');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-open');

  grunt.registerTask('install', ['bgShell:install']);
  grunt.registerTask('start', ['bgShell:server']);
  grunt.registerTask('compilers', ['bgShell:development', 'open', 'watch']);
  grunt.registerTask('default', ['compilers']);

};



