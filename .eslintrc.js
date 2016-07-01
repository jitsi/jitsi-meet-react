module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'es6': true
    },
    'extends': ['eslint:recommended', 'plugin:react/recommended'],
    'parserOptions': {
        'ecmaFeatures': {
            'experimentalObjectRestSpread': true,
            'jsx': true
        },
        'sourceType': 'module'
    },
    'plugins': [
        'jsdoc',
        'react'
    ],
    'rules': {
        'indent': [ 'error', 4, { 'SwitchCase': 0 } ],
        'linebreak-style': [ 'error', 'unix' ],
        'max-len': [ 'error', 80 ],
        'no-console': [ 'off' ],
        'quotes': [ 'error', 'single' ],
        'require-jsdoc': [
            'error',
            {
                'require': {
                    'ClassDeclaration': true,
                    'FunctionDeclaration': true,
                    'MethodDefinition': true
                }
            }
        ],
        'semi': [ 'error', 'always' ],
        // Currently, we are using both valid-jsdoc and 'jsdoc' plugin. In the
        // future we might stick to one as soon as it has all the features.
        'valid-jsdoc': [
            'error',
            {
                'matchDescription': '.+',
                'prefer': {
                    'arg': 'param',
                    'argument': 'param',
                    'return': 'returns'
                },
                'preferType': {
                    'array': 'Array',
                    'Boolean': 'boolean',
                    'function': 'Function',
                    'Number': 'number',
                    'object': 'Object',
                    'String': 'string'
                },
                'requireParamDescription': true,
                'requireReturn': true,
                'requireReturnDescription': false,
                'requireReturnType': true
            }
        ],
        // The following rules are in addition to valid-jsdoc.
        'jsdoc/check-tag-names': [ 'error' ],
        'jsdoc/newline-after-description': [ 'error' ],
        // XXX Because the following plugin is not very smart about words which
        // legitimately begin with uppercase characters mid-sentence, set it to
        // warn only.
        'jsdoc/require-description-complete-sentence': [ 'warn' ],
        'jsdoc/require-hyphen-before-param-description': [ 'error' ],
        // The following rules are covered by valid-jsdoc, so disable them.
        'jsdoc/check-param-names': 0,
        'jsdoc/check-types': 0,
        'jsdoc/require-param': 0,
        'jsdoc/require-param-description': 0,
        'jsdoc/require-param-type': 0,
        'jsdoc/require-returns-description': 0,
        'jsdoc/require-returns-type': 0
    }
};
