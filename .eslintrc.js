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
        "react"
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
                "requireParamDescription": false,
                "requireReturnDescription": false
            }
        ]
    }
};