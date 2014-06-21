module.exports = function(grunt) {
    // config
    grunt.initConfig({
        appName: 'mine',
        concat: {
            server: {
                src: 'src/main/webapp/index.html',
                dest: 'src/main/webapp/index-dev.html',
                options: {
                    footer: '<script src="http://localhost:35729/livereload.js"></script>'
                }
            }
        },
        typescript: {
            compile: {
                src: [
                    '<%=copy.compile.dest%>/<%=appName%>/**/*.ts',
                    '<%=copy.compile.dest%>/app.ts',
                    'typings/**/*.d.ts'
                ],
                dest: '<%=copy.compile.dest%>/<%=appName%>.js',
                options: {
                    sourceMap: true,
                    declaration: true
                }
            },
            compile_test: {
                src: [
                    'src/main/ts/**/*-test.ts',
                    '<%=copy.compile.dest%>/<%=appName%>.d.ts',
                    'typings/**/*.d.ts',
                ],
                dest: 'build/ts/<%=appName%>-test.js'
            }
        },
        uglify: {
            minify: {
                src: '<%=typescript.compile.dest%>',
                dest: '<%=copy.compile.dest%>/<%=appName%>.min.js',
                options: {
                    sourceMapIn: '<%= typescript.compile.dest %>.map',
                    sourceMapRoot: '',
                    sourceMap: '<%=uglify.minify.dest%>'
                }
            }
        },
        jasmine: {
            test: {
                src: [
                    'bower_components/angular/*.js',
                    'bower_components/jquery/dist/*.js',
                    'bower_components/underscore/*.js',
                    '<%= uglify.minify.dest %>'
                ],
                options: {
                    specs: '<%= typescript.compile_test.dest %>',
                    keepRunner: true,
                    junit: {
                        path: 'build/jasmine-test/'
                    }
                }
            }
        },
        copy: {
            init: {
                files: [
                    // js files
                    {expand: true, cwd: 'bower_components/angular/',       src: '*',  dest: 'src/main/webapp/scripts/vendor/angular/'},
                    {expand: true, cwd: 'bower_components/jquery/dist',    src: '*',  dest: 'src/main/webapp/scripts/vendor/jquery/'},
                    {expand: true, cwd: 'bower_components/underscore',     src: '*',  dest: 'src/main/webapp/scripts/vendor/underscore/'},
                    {expand: true, cwd: 'bower_components/bootstrap/dist', src: '**', dest: 'src/main/webapp/scripts/vendor/bootstrap/'},
                    {expand: true, cwd: 'bower_components/html5shiv/dist', src: '*',  dest: 'src/main/webapp/scripts/vendor/html5shiv/'},
                    {expand: true, cwd: 'bower_components/respond/dest',   src: '*',  dest: 'src/main/webapp/scripts/vendor/respond/'},
                    
                    // d.ts files
                    {expand: true, src: 'typings/**/*.d.ts', dest: 'src/main/ts/vendor', flatten: true},
                ]
            },
            compile: {
                expand: true,
                cwd: 'src/main/ts/',
                src: ['**/*.ts', '!**/*-test.ts'],
                dest: 'build/scripts/'
            },
            deploy: {
                expand: true,
                cwd: '<%=copy.compile.dest%>',
                src: ['**/*.ts', '**/*.js', '**/*.map', '!**/*.d.ts'],
                dest: 'src/main/webapp/scripts/app/'
            },
            build: {
                expand: true,
                cwd: 'src/main/webapp/',
                src: ['**', '!index-dev.html'],
                dest: 'build/dist/<%=appName%>/'
            }
        },
        clean: [
            'build/',
            'src/main/webapp/scripts/app/',
            'src/main/webapp/scripts/vendor/',
            'src/main/webapp/index-dev.html',
            'src/main/ts/vendor/',
        ],
        connect: {
            server: {
                options: {
                    port: 8543,
                    hostname: 'localhost',
                    base: 'src/main/webapp',
                    open: 'http://<%=connect.server.options.hostname%>:<%=connect.server.options.port%>/index-dev.html'
                }
            }
        },
        watch: {
            server: {
                files: ['src/main/ts/**/*.ts', 'src/main/webapp/index.html'],
                tasks: ['minify', 'concat:server'],
                options: {
                    event: ['added', 'deleted', 'changed'],
                    livereload: true
                }
            }
        }
    });

    // plugin
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // tasks
    grunt.registerTask('init', [
        'copy:init'
    ]);
    
    grunt.registerTask('compile', [
        'copy:compile',
        'typescript:compile',
        'typescript:compile_test'
    ]);
    
    grunt.registerTask('minify', [
        'compile',
        'uglify:minify'
    ]);
    
    grunt.registerTask('test', [
        'minify',
        'jasmine:test'
    ]);
    
    grunt.registerTask('deploy', [
        'init',
        'minify',
        'copy:deploy'
    ]);
    
    grunt.registerTask('build', [
        'deploy',
        'copy:build'
    ]);
    
    grunt.registerTask('server', [
        'deploy',
        'concat:server',
        'connect:server',
        'watch:server'
    ]);
};
