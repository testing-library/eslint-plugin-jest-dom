module.exports = {
    /** Repositories to scan */
    repositories: require('./repositories.json'),

    /** Extensions of files under scanning */
    extensions: ['js', 'jsx', 'ts', 'tsx'],

    /** Optional pattern used to exclude paths */
    pathIgnorePattern: `(${[
        'node_modules',
        '\\/\\.', // Any file or directory starting with dot, e.g. ".git"
        '/dist/',
        '/build/',

        // Common patterns for minified JS
        'babel\\.js',
        'vendor\\.js',
        'vendors\\.js',
        'chunk\\.js',
        'bundle\\.js',
        'react-dom\\.development\\.js',
        '\\.min\\.js', // Any *.min.js

        // Project specific ignores
        'codesandbox-client/packages/app/static/js',
        'codesandbox-client/standalone-packages',
        'dockunit/platform/assets',
        'hyper/bin',
        'react-solitaire/lib/index\\.js',
        'Khan/perseus/lib',
        'glortho/react-keydown/example/public',
        'reach/reach-ui/packages/combobox/examples/cities\\.ts',
        'reach/reach-ui/website/src/components/cities\\.js',
        'reach/reach-ui/website/static/router/static',
        'Automattic/wp-calypso/client/components/phone-input/data\\.js',
        'test262-main\\.ts',
        'sample_vis\\.test\\.mocks\\.ts',
    ].join('|')})`,

    /** Empty array since we are only interested in linter crashes */
    rulesUnderTesting: [],

    /** Maximum amount of tasks ran concurrently */
    concurrentTasks: 2,

    /** Optional boolean flag used to enable caching of cloned repositories. For CIs it's ideal to disable caching. Defauls to true. */
    cache: false,

    /** ESLint configuration */
    eslintrc: {
        root: true,
        env: {
            es6: true,
        },
        parser: '@typescript-eslint/parser',
        parserOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            ecmaFeatures: {
                jsx: true,
            },
        },
        plugins: [
            'jest-dom',
        ],
        extends: [
            'plugin:jest-dom/recommended',
        ],
        rules: {
            'prefer-in-document': 'error'
        },
    },
};
