var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    // mockファイルのパス設定
    var mockConfig = {
        app: 'app',    //アプリが入っているディレクトリ名
        dist: 'build' //ビルドするディレクトリ名
    };

    grunt.initConfig({
        mock: mockConfig,
        //監視設定
        watch: {
            options: {
                nospawn: true
            },
            //ライブリロード設定
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= mock.app %>/*.html'
                ]
            }
        },
        //ローカルサーバー設定
        connect: {
            options: {
                port: 9000,
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function (connect) {
                        return [
                            proxySnippet,
                            mountFolder(connect, mockConfig.app)
                        ];
                    }
                }
            },
            proxies: [{
                context: '/api',
                host: 'localhost',
                port: '3000',
                https: false,
                changeOrigin: false
            }],
        },
        clean: {
            server: '.tmp'
        }
    });


    // defaultタスク
    grunt.registerTask('server', function(target) {
        grunt.task.run([
            'clean:server',
            'configureProxies',
            'connect:livereload',
            'watch'
        ])
    });
    grunt.registerTask('default', function(target) {
        grunt.task.run([
            'clean:server',
            'open'
        ])
    });

};