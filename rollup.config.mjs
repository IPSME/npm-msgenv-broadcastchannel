import resolve from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';
// import json from '@rollup/plugin-json';

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
		input: 'src/ipsme_msgenv.js',
		output: {
			name: "ipsme_msgenv",
			file: 'dist/ipsme_msgenv.es.mjs',
			format: 'es'
		},
		plugins: [resolve()]
	}
];
