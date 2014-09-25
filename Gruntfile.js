module.exports = function(grunt) {

   // Project configuration.
   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      uglify: {
         options: {
            compress: {
               drop_console: true
            }
         },
         my_target: {
            files: {
               'bundle.min.js': ['bundle.js']
            }
         }
      },
      watch: {
         scripts: {
            files: ['src/**/*.js*'],
            tasks: ['build'],
            options: {
               spawn: true,
            },
         },
         express: {
            files: [ 'build/**/*.js'],
            tasks: [ 'express:dev'],
            options: { spawn: false }
         }
      },
      jsbeautifier: {
         files: ['src/**.*.js'],
         options: {
            js: {
               braceStyle: "collapse",
               breakChainedMethods: false,
               e4x: false,
               evalCode: false,
               indentChar: " ",
               indentLevel: 0,
               indentSize: 3,
               indentWithTabs: false,
               jslintHappy: false,
               keepArrayIndentation: false,
               keepFunctionIndentation: false,
               maxPreserveNewlines: 4,
               preserveNewlines: true,
               spaceBeforeConditional: true,
               spaceInParen: false,
               unescapeStrings: false,
               wrapLineLength: 80
            }
         }
      },
      react: {
         dynamic_mappings: {
            files: [
               {
                  expand: true,
                  cwd: 'src/public/components',
                  src: ['**/*.jsx'],
                  dest: 'src/public/.components-compiled',
                  ext: '.js',
               }
            ]
         }
      },

      traceur: {
         options: {
           includeRuntime: false,
           modules: 'commonjs',
           sourceMaps: false,

           arrowFunctions: true,
           classes: true,
           blockBinding: true,
           defaultParameters: true,
           destructuring: true,
           propertyMethods: true,
           propertyNameShorthand: true,
           restParameters: true,
           spread: true,

           forOf: true,
           templateLiterals: true,

           computedPropertyNames: true,

           referrer: '',

           asyncFunctions: false,
           arrayComprehension: false,
           generatorComprehension: false,
           generators: false,

           unicodeExpressions: false,
           annotations: false,
           commentCallback: false,
           debug: false,
           exponentiation: false,
           freeVariableChecker: false,
           moduleName: false,
           numericLiterals: true,
           outputLanguage: 'es5',
           symbols: false,
           script: false,
           typeAssertionModule: null,
           typeAssertions: false,
           types: false,
           unicodeEscapeSequences: false,
           validate: false,
         },
         custom: {
            files: [{
               expand: true,
               cwd: 'src',
               src: ['**/*.js', '!public/components/**', '!public/.components-compiled/**'],
               dest: 'build/'
            },{
               expand: true,
               cwd: 'src/public/.components-compiled',
               src: ['**/*.js'],
               dest: 'build/public/components'

            }]
         },
      },
      browserify: {
         dist: {
            files: {
               'assets/public.js': ['build/public/**/*.js']
            },
         }
      },
      express: {
         options: {
         // Override defaults here
         },
         dev: {
            options: {
               script: 'build/server.js'
            }
         },
         prod: {
           options: {
              script: 'build/server.js',
              node_env: 'production'
           }
         },
         test: {
            options: {
               script: 'build/server.js'
            }
         }
      } 
   });

   // Load the plugin that provides the "uglify" task.
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-jsbeautifier');
   grunt.loadNpmTasks('grunt-react');
   grunt.loadNpmTasks('grunt-traceur');
   grunt.loadNpmTasks('grunt-browserify');
   grunt.loadNpmTasks('grunt-express-server');

   grunt.registerTask('build', ['react', 'traceur', 'browserify'])

   // Default task(s).
   grunt.registerTask('default', ['build', 'express:dev', 'watch']);

};
