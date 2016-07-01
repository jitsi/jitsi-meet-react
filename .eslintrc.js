module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": ["eslint:recommended", "plugin:react/recommended"],
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "jsdoc"
    ],
    "rules": {
        "indent": [
            "error",
            4,
            { "SwitchCase": 0 }
        ],
        "no-console": [
            "off"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "max-len": [
            "error",
            80
        ],
        "require-jsdoc": [
            "error",
            {
                "require": {
                    "FunctionDeclaration": true,
                    "MethodDefinition": true,
                    "ClassDeclaration": true
                }
            }
        ],
        // Currently we are using both valid-jsdoc and 'jsdoc' plugin,
        // but in future we might stick to a single one in future as soon as
        // one of them has all features.
        "valid-jsdoc": [
            "error",
            {
                "prefer": {
                    "arg": "param",
                    "argument": "param",
                    "return": "returns"
                },
                "preferType": {
                    "Boolean": "boolean",
                    "Number": "number",
                    "String": "string",
                    "object": "Object",
                    "array": "Array",
                    "function": "Function"
                },
                "requireReturn": true,
                "requireReturnType": true,
                "matchDescription": ".+",
                "requireParamDescription": true,
                "requireReturnDescription": false
            }
        ],
        // These rules are additional to valid-jsdoc.
        "jsdoc/check-tag-names": [
            "error"
        ],
        "jsdoc/newline-after-description": [
            "error"
        ],
        "jsdoc/require-description-complete-sentence": [
            "error"
        ],
        "jsdoc/require-hyphen-before-param-description": [
            "error"
        ],
        // Those rules are covered by valid-jsdoc, so disable them.
        "jsdoc/check-types": 0,
        "jsdoc/check-param-names": 0,
        "jsdoc/require-param": 0,
        "jsdoc/require-param-description": 0,
        "jsdoc/require-param-type": 0,
        "jsdoc/require-returns-description": 0,
        "jsdoc/require-returns-type": 0
    }
};