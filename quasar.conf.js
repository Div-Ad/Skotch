/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
/* eslint-env node */

const fs = require('fs-extra')

// Environment Variables
let env = JSON.parse(fs.readFileSync('.quasar.env.json'))[process.env.QENV]

module.exports = function (ctx) {
    return {
        htmlVariables: {
            skKeywords: "note, avis, recommandation, conseil, copain, ami, skotch, scotch, oubli, liste, watchlist, bingelist, playlist, lecture, voyage, liste d'achat, manga"
        },
        // https://quasar.dev/quasar-cli/supporting-ts
        supportTS: true,

        // https://quasar.dev/quasar-cli/prefetch-feature
        // preFetch: true,

        // app boot file (/src/boot)
        // --> boot files are part of "main.js"
        // https://quasar.dev/quasar-cli/boot-files
        boot: [
            'composition-api',
            'firebase',
            'auth',
            'boot',
            'i18n',
            'dialog',
            'toasted',
            'vue2touchevents',
            'vuelidate',
            'apollo',
            ctx.mode.capacitor ? 'google-analytics' : '',
            'vueCroppie'
        ],

        bin: {
            linuxAndroidStudio: '/home/pierre/Documents/Software/toolbox/apps/AndroidStudio/ch-0/212.5712.43.2112.8512546/bin/studio.sh'
        },

        // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
        css: [env.VERSION_MAIN_CSS],

        // https://github.com/quasarframework/quasar/tree/dev/extras
        extras: [
            // 'ionicons-v4',
            // 'mdi-v5',
            // 'fontawesome-v5',
            // 'eva-icons',
            // 'themify',
            // 'line-awesome',
            // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

            // 'roboto-font', // optional, you are not bound to it
            // 'material-icons' // optional, you are not bound to it
        ],

        // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
        build: {
            vueRouterMode: 'history', // available values: 'hash', 'history'
            // transpile: false,

            // Add dependencies for transpiling with Babel (Array of string/regex)
            // (from node_modules, which are by default not transpiled).
            // Applies only if "transpile" is set to true.
            // transpileDependencies: [],

            // rtl: false, // https://quasar.dev/options/rtl-support
            // preloadChunks: true,
            // showProgress: false,
            // gzip: true,
            // analyze: true,

            // Options below are automatically set depending on the env, set them if you want to override
            // extractCSS: false,

            // https://quasar.dev/quasar-cli/handling-webpack
            extendWebpack(cfg) {
                cfg.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /node_modules/
                })
                cfg.module.rules.push({
                    test: /\.pug$/,
                    loader: 'pug-plain-loader'
                })
                cfg.module.rules.push({
                    test: /\.(graphql|gql)$/,
                    exclude: /node_modules/,
                    loader: 'graphql-tag/loader'
                })
            },
            env: {
                versionTitle: env.VERSION_NAME,
                versionUrl: env.VERSION_URL,
                versionType: env.VERSION,
                versionDescription: env.VERSION_DESCRIPTION,
                versionIconDirectory: env.VERSION_ICON_DIRECTORY
            }
        },

        // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
        devServer: {
            https: false,
            port: 8080,
            //host: '192.168.1.84',
            open: true // opens browser window automatically
        },

        // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
        framework: {
            iconSet: null, // Quasar icon set
            lang: 'en-us', // Quasar language pack
            config: {
                capacitor: {
                    iosStatusBarPadding: true, // add the dynamic top padding on iOS mobile devices
                    // On the other hand, the following completely
                    // disables Quasar's back button management.
                    // Requires Quasar v1.14.1+
                    backButton: true
                }
            },

            // Possible values for "importStrategy":
            // * 'auto' - (DEFAULT) Auto-import needed Quasar components & directives
            // * 'all'  - Manually specify what to import
            importStrategy: 'auto',

            // For special cases outside of where "auto" importStrategy can have an impact
            // (like functional components as one of the examples),
            // you can manually specify Quasar components/directives to be available everywhere:
            //
            // components: [],
            // directives: [],

            // Quasar plugins
            plugins: []
        },

        // animations: 'all', // --- includes all animations
        // https://quasar.dev/options/animations
        animations: [],

        // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
        ssr: {
            pwa: false
        },

        // https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa
        pwa: {
            workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
            workboxOptions: {
                skipWaiting: true,
                clientsClaim: true,
                maximumFileSizeToCacheInBytes: 5000000,
            }, // only for GenerateSW
            manifest: {
                name: env.VERSION_NAME,
                short_name: env.VERSION_SHORTCUT,
                description: env.DESCRIPTION,
                display: 'standalone',
                orientation: 'portrait',
                background_color: env.VERSION_COLOR,
                theme_color: env.VERSION_COLOR,
                share_target: {
                    action: "/share-target/",
                    method: "GET",
                    params: {
                        title: "title",
                        text: "text",
                        url: "url"
                    }
                },
                start_url: '/',
                icons: [
                    {
                        "src": env.VERSION_ICON_DIRECTORY + "android/mobile-favicon-192.png",
                        "sizes": "192x192",
                        "type": "image/png"
                    },
                    {
                        "src": env.VERSION_ICON_DIRECTORY + "appicons/appicon-maskable-128.png",
                        "sizes": "128x128",
                        "type": "image/png"
                    },
                    {
                        "src": env.VERSION_ICON_DIRECTORY + "appicons/appicon-maskable-256.png",
                        "sizes": "256x256",
                        "type": "image/png"
                    },
                    {
                        "src": env.VERSION_ICON_DIRECTORY + "appicons/appicon-splasher-384.png",
                        "sizes": "384x384",
                        "type": "image/png"
                    },
                    {
                        "src": env.VERSION_ICON_DIRECTORY + "appicons/appicon-splasher-512.png",
                        "sizes": "512x512",
                        "type": "image/png",
                        "purpose": "badge"
                    },
                    {
                        "src": env.VERSION_ICON_DIRECTORY + "appicons/appicon-maskable-512.png",
                        "sizes": "512x512",
                        "type": "image/png",
                        "purpose": "maskable"
                    }
                ]
            },
            metaVariables: {
                appleMobileWebAppCapable: 'yes',
                appleMobileWebAppStatusBarStyle: 'black-translucent',
                appleTouchIcon120: env.VERSION_ICON_DIRECTORY + 'apple-touch-icon-120x120-precomposed.png',
                appleTouchIcon152: env.VERSION_ICON_DIRECTORY + 'apple-touch-icon-152x152-precomposed.png',
                appleTouchIcon167: env.VERSION_ICON_DIRECTORY + 'apple-touch-icon-167x167-precomposed.png',
                appleTouchIcon180: env.VERSION_ICON_DIRECTORY + 'apple-touch-icon-180x180-precomposed.png',
                appleSafariPinnedTab: 'ios/safari-pinned-tab.svg',
                msapplicationTileImage: 'mstile-144x144.png',
                msapplicationTileColor: '#ffffff'
            },
        },

        // Full list of options: https://quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
        cordova: {
            // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
        },

        // Full list of options: https://quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
        capacitor: {
            capacitorCliPreparationParams: [ 'sync', ctx.targetName ],
            version: 3
        },

        // Full list of options: https://quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
        electron: {
            bundler: 'packager', // 'packager' or 'builder'

            packager: {
                // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
                // OS X / Mac App Store
                // appBundleId: '',
                // appCategoryType: '',
                // osxSign: '',
                // protocol: 'myapp://path',
                // Windows only
                // win32metadata: { ... }
            },

            builder: {
                // https://www.electron.build/configuration/configuration

                appId: 'skotch'
            },

            // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
            nodeIntegration: true,

            extendWebpack(/* cfg */) {
                // do something with Electron main process Webpack cfg
                // chainWebpack also available besides this extendWebpack
            }
        }
    }
}
