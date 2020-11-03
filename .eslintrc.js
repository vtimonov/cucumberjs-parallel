module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'es2021': true,
        'node': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 12
    },
    'rules': {
        'semi': 'error',
        'quotes': ['warn', 'single'],
        'no-throw-literal': 'error',
        'no-var':'error'
    }
};
