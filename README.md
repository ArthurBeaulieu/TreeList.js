# TreeList.js

![](https://badgen.net/badge/version/0.0.1/blue)
[![License](https://img.shields.io/github/license/ArthurBeaulieu/TreeList.js.svg)](https://github.com/ArthurBeaulieu/TreeList.js/blob/master/LICENSE.md)
![](https://badgen.net/badge/documentation/written/green)
![](https://badgen.net/badge/test/passed/green)
![](https://badgen.net/badge/dependencies/none/green)

`TreeList.js` is a JavaScript ES6 component that displays a hierarchical node structure into a tree list view, with controls to expand or collapse any node in the graph.

With ~7Ko minified, `TreeList.js` is designed to be stable and remain as light as possible.

# Get Started

This repository was made to store documentation, test bench and source code. The first step for you to get started with `TreeList.js` is to copy both the `dist/TreeList.min.js` and `dist/treelist.min.css` files in your code base. Once pasted, don't forget to include the style and the script in your HTML page. `TreeList.js` is ready to be used.

```javascript
import TreeList from 'path/to/TreeList.js';
const myTreeList = new TreeList({
	renderTo: document.body, // The DOM element to insert TreeList in
	nodeClicked: node => { // Callback on list item click
		alert(node); // Contains id, name, depth, isLeaf, isExpanded
	},
	model: [{ // The model to display, id are optionnal
		id: 1,
		name: 'Root node',
		children: [{
			id: 2,
			name: 'Child node',
			children: []
		}]
	}]
});
```

There are an expand all and collapse all method that are available to manually control the global expand state of the graph.

```javascript
myTreeList.expandAll();
myTreeList.collapseAll();
```

You're now good to go! If however you need more information, you can read the online [documentation](https://arthurbeaulieu.github.io/TreeList.js/doc/).

# Development

If you clone this repository, you can `npm install` to install development dependencies. This will allow you to build dist file, run the component tests or generate the documentation ;

- `npm run build` to generate the minified file ;
- `npm run dev` to watch for any change in source code ;
- `npm run web-server` to launch a local development server ;
- `npm run doc` to generate documentation ;
- `npm run test` to perform all tests at once ;
- `npm run testdev` to keep browsers open to debug tests ;
- `npm run beforecommit` to perform tests, generate doc and bundle the JavaScript.

To avoid CORS when locally loading the example HTML file, run the web server. Please do not use it on a production environment. Unit tests are performed on both Firefox and Chrome ; ensure you have both installed before running tests, otherwise they might fail.

If you have any question or idea, feel free to DM or open an issue (or even a PR, who knows) ! I'll be glad to answer your request.
