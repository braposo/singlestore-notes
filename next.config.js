const ReactServerWebpackPlugin = require('react-server-dom-webpack/plugin');
const fs = require('fs');

let manifest;
class CopyReactClientManifest {
    apply(compiler) {
        compiler.hooks.emit.tapAsync(
            'CopyReactClientManifest',
            (compilation, callback) => {
                const asset = compilation.assets['react-client-manifest.json'];
                const content = asset.source();
                // there might be multiple passes (?)
                // we keep the larger manifest
                if (manifest && manifest.length > content.length) {
                    callback();
                    return;
                }
                manifest = content;
                fs.writeFile(
                    './libs/react-client-manifest.json',
                    content,
                    callback
                );
            }
        );
    }
}

module.exports = {
    experimental: {
        reactMode: 'concurrent',
    },
    api: {
        bodyParser: false,
    },
    webpack: config => {
        config.plugins.push(new ReactServerWebpackPlugin({ isServer: false }));
        config.plugins.push(new CopyReactClientManifest());
        return config;
    },
    async headers() {
        return [
            {
                // matching all API routes
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Credentials', value: 'true' },
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value:
                            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
                    },
                ],
            },
        ];
    },
};
