const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV || 'development';
const isDev = mode === 'development';

module.exports = {
    mode,
    performance: {
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
    entry: {
        content: path.resolve(__dirname, 'src', 'pages', 'index.js'),
        // chart: path.resolve(__dirname, 'src', 'entities', 'bid-panel-chart', 'ui', 'chart.js'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        clean: {
            keep: /manifest.json/,
        },
        filename: '[name].js',
        assetModuleFilename: '[name][ext]',
        publicPath: '',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'processes', 'popups', 'popup.html'),
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                auto: (resPath) => Boolean(resPath.includes('.module.')),
                                localIdentName: '[hash:base64:8]',
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(jpe?g|png|webp|gif|svg)$/i,
                use: {
                    loader: 'image-webpack-loader',
                    options: {
                        mozjpeg: {
                            progressive: true,
                        },
                        // optipng.enabled: false will disable optipng
                        optipng: {
                            enabled: false,
                        },
                        pngquant: {
                            quality: [0.65, 0.9],
                            speed: 4,
                        },
                        gifsicle: {
                            interlaced: false,
                        },
                        // the webp option will enable WEBP
                        webp: {
                            quality: 75,
                        },
                    },
                },
                generator: {
                    filename: 'icon/[name][ext]',
                },
                type: 'asset/resource',
            },
        ],
    },
};
