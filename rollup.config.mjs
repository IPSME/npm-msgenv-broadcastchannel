import resolve from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';
// import json from '@rollup/plugin-json';
import dts from "rollup-plugin-dts";

export default [
	// {
	// 	input: 'src/ipsme_msgenv.mjs',
	// 	output: {
	// 		name: "ipsme_msgenv",
	// 		file: 'dist/ipsme_msgenv.cjs.js',
	// 		format: 'cjs'
	// 	},
	// 	// plugins: [resolve()]
	// },
	{
		input: 'src/ipsme_msgenv.mjs',
		output: {
			name: "ipsme_msgenv",
			file: 'dist/ipsme_msgenv.es.mjs',
			format: 'es'
		},
		plugins: [resolve()]
	},
	{
		input: "src/ipsme_msgenv.d.ts",
		output: [{ file: "dist/ipsme_msgenv.d.ts", format: "es" }],
		plugins: [dts()],
	}
];
