const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        proxy: {
            '/api': {
                // target: "http://krw.ddns.net:8080/",
                target: "http://127.0.0.1:8000",
                changeOrigin: true,
                secure: false,
            }
        }
    }
})
