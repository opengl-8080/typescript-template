module.exports = function(grunt) {
    // config
    grunt.initConfig({
        appName: 'mine',
        dirs: {
            dist: {
                vendor: 'build/dist/scripts/vendor'
            }
        },
        typescript: {
            compile: {
                src: '<%=concat.compile.dest%>',
                dest: 'build/js/<%=appName%>.js',
                options: {
                    sourceMap: true,
                    declaration: true
                }
            },
            compile_test: {
                src: [
                    'src/test/ts/**/*.ts',
                    'typings/**/*.d.ts',
                    'build/js/<%=appName%>.d.ts'
                ],
                dest: 'build/js/<%=appName%>-test.js'
            }
        },
        uglify: {
            minify: {
                src: '<%=typescript.compile.dest%>',
                dest: 'build/js/<%=appName%>.min.js',
                options: {
                    sourceMapIn: '<%= typescript.compile.dest %>.map',
                    sourceMapRoot: '',
                    sourceMap: '<%=uglify.minify.dest%>'
                }
            }
        },
        jasmine: {
            test: {
                src: '<%= uglify.minify.dest %>',
                options: {
                    specs: '<%= typescript.compile_test.dest %>',
                    keepRunner: true,
                    junit: {
                        path: 'build/jasmine-test/'
                    }
                }
            }
        },
        concat: {
            compile: {
                src: 'src/main/ts/**/*.ts',
                dest: 'build/js/<%=appName%>.ts'
            },
            server: {
                src: 'build/dist/index.html',
                dest: '<%=concat.server.src%>',
                options: {
                    footer: '<script src="http://localhost:35729/livereload.js"></script>'
                }
            }
        },
        replace: {
            package: {
                expand: true,
                cwd: 'build/dist/',
                src: '**/*.html',
                dest: 'build/dist/',
                options: {
                    patterns: [
                        {
                            json: {
                                'appName': '<%=appName%>'
                            }
                        }
                    ]
                }
            }
        },
        copy: {
            package: {
                files: [
                    // index.html and view html
                    {expand: true, cwd: 'src/main/html/', src: '**/*.html', dest: 'build/dist/'},
                    // javascript
                    {expand: true, cwd: 'build/js/', src: '*', dest: 'build/dist/scripts/app/'},
                    {expand: true, cwd: 'bower_components/angular/', src: '*', dest: '<%=dirs.dist.vendor%>/angular/'},
                    {expand: true, cwd: 'bower_components/jquery/dist', src: '*', dest: '<%=dirs.dist.vendor%>/jquery/'},
                    {expand: true, cwd: 'bower_components/underscore', src: '*', dest: '<%=dirs.dist.vendor%>/underscore/'},
                    {expand: true, cwd: 'bower_components/bootstrap/dist', src: '**', dest: '<%=dirs.dist.vendor%>/bootstrap/'},
                    // app.css
                    {src: 'src/main/css/app.css', dest: 'build/dist/styles/app/<%=appName%>.css'},
                    // image
                    {expand: true, cwd: 'src/main/image/', src: '**', dest: 'build/dist/images/'}
                ]
            }
        },
        clean: ['build'],
        connect: {
            server: {
                options: {
                    port: 8543,
                    hostname: 'localhost',
                    base: 'build/dist/',
                    open: 'http://<%=connect.server.options.hostname%>:<%=connect.server.options.port%>/'
                }
            }
        },
        watch: {
            server: {
                files: ['src/main/**/*'],
                tasks: ['build', 'concat:server'],
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
    grunt.loadNpmTasks('grunt-replace');

    // tasks
    grunt.registerTask('compile', [
        'concat:compile',
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
    
    grunt.registerTask('build', [
        'minify',
        'copy:package',
        'replace:package'
    ]);
    
    grunt.registerTask('server', [
        'build',
        'concat:server',
        'connect:server',
        'watch:server'
    ]);
};
