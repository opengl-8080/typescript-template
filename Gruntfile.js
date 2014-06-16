module.exports = function(grunt) {
    // config
    grunt.initConfig({
        appName: 'mine',
        dirs: {
            web: 'src/main/webapp',
            vendorjs: '<%=dirs.web%>/scripts/vendor',
            appjs: '<%=dirs.web%>/scripts/app'
        },
        files: {
            typescript: 'src/main/ts/**/*.ts',
            index: '<%=dirs.web%>/index.html',
            devIndex: {
                path: '<%=dirs.web%>/<%=files.devIndex.name%>',
                name: 'index-dev.html'
            }
        },
        typescript: {
            compile: {
                src: '<%=concat.compile.dest%>',
                dest: '<%=dirs.appjs%>/<%=appName%>.js',
                options: {
                    sourceMap: true,
                    declaration: true
                }
            },
            compile_test: {
                src: [
                    'src/test/ts/**/*.ts',
                    'typings/**/*.d.ts',
                    '<%=dirs.appjs%>/<%=appName%>.d.ts'
                ],
                dest: 'build/js/<%=appName%>-test.js'
            }
        },
        uglify: {
            minify: {
                src: '<%=typescript.compile.dest%>',
                dest: '<%=dirs.appjs%>/<%=appName%>.min.js',
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
                src: '<%=files.typescript%>',
                dest: '<%=dirs.appjs%>/<%=appName%>.ts'
            },
            server: {
                src: '<%=files.index%>',
                dest: '<%=files.devIndex.path%>',
                options: {
                    footer: '<script src="http://localhost:35729/livereload.js"></script>'
                }
            }
        },
        copy: {
            init: {
                files: [
                    {expand: true, cwd: 'bower_components/angular/', src: '*', dest: '<%=dirs.vendorjs%>/angular/'},
                    {expand: true, cwd: 'bower_components/jquery/dist', src: '*', dest: '<%=dirs.vendorjs%>/jquery/'},
                    {expand: true, cwd: 'bower_components/underscore', src: '*', dest: '<%=dirs.vendorjs%>/underscore/'},
                    {expand: true, cwd: 'bower_components/bootstrap/dist', src: '**', dest: '<%=dirs.vendorjs%>/bootstrap/'},
                ]
            },
            build: {
                files: [
                    {expand: true, cwd: '<%=dirs.web%>/', src: '**', dest: 'build/dist/<%=appName%>/'}
                ]
            }
        },
        clean: [
            'build/',
            '<%=dirs.appjs%>/',
            '<%=files.devIndex.path%>/'
        ],
        connect: {
            server: {
                options: {
                    port: 8543,
                    hostname: 'localhost',
                    base: '<%=dirs.web%>',
                    open: 'http://<%=connect.server.options.hostname%>:<%=connect.server.options.port%>/<%=files.devIndex.name%>'
                }
            }
        },
        watch: {
            server: {
                files: ['<%=files.typescript%>', '<%=files.index%>'],
                tasks: ['minify', 'concat:server'],
                options: {
                    event: ['added', 'deleted', 'changed'],
                    livereload: true
                }
            }
        },
        replace: {
            init: {
                src: '<%=files.index%>',
                dest: '<%=replace.init.src%>',
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
    grunt.registerTask('init', [
        'copy:init',
        'replace:init'
    ]);
    
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
        'init',
        'test',
        'copy:build'
    ]);
    
    grunt.registerTask('server', [
        'minify',
        'concat:server',
        'connect:server',
        'watch:server'
    ]);
};
