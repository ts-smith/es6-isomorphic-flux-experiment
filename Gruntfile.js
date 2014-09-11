module.exports = function(grunt) {

   // Project configuration.
   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      uglify: {
         options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
         },
         build: {
            src: 'src/<%= pkg.name %>.js',
            dest: 'build/<%= pkg.name %>.min.js'
         }
      },
      watch: {
         scripts: {
            files: ['components/**/*.js', 'src/**/*.js'],
            tasks: ['compile'],
            options: {
               spawn: true,
            },
         }
      },
      react: {
         dynamic_mappings: {
            files: [
               {
                  expand: true,
                  cwd: 'components',
                  src: ['**/*.js'],
                  dest: 'src/public/components',
                  ext: '.js',
               }
            ]
         }
      },

      traceur: {
         options: {
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
           sourceMaps: true,

           computedPropertyNames: true,

           modules: 'register',
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
               src: ['**/*.js'],
               dest: 'build/'
            }]
         },
      },
      browserify: {
         dist: {
            files: {
               'public.js': ['build/public/**/*.js']
            }
         }
      }
   });

   // Load the plugin that provides the "uglify" task.
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-react');
   grunt.loadNpmTasks('grunt-traceur');
   grunt.loadNpmTasks('grunt-browserify');

   grunt.registerTask('compile', ['react', 'traceur', 'browserify'])

   // Default task(s).
   grunt.registerTask('default', ['compile', 'watch']);

};
