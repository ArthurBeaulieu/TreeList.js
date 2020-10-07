import TreeListNode from './TreeListNode.js';
'use strict';


class TreeList {


  /** @summary Create a tree list view with interactive nodes
   * @author Arthur Beaulieu
   * @since October 2020
   * @description <blockquote>This component will build a hierarchical tree with given model. The model must fit the format
   * described in the <code>README.md</code>. Each node can then be expanded or collapsed if it contains children. Each node
   * will also fire a given callback when clicked, sending its information so further handling can be done on the caller side.
   * It finally expose some global method to update the tree by code (expand or collapse all).</blockquote>
   * @param {object} options - The TreeList global options
   * @param {object} options.renderTo - The DOM element to render the TreeList in
   * @param {object[]} options.model - The model to build the TreeList with. Must match the format described on this component's repository 
   * @param {function} [options.nodeClicked] - The callback function to provided that will be called each time a node is clicked */
  constructor(options = {}) {
    // Prevent wrong type for arguments, fallback according to attribute utility
    if (typeof options.renderTo !== 'object' || (options.renderTo && !options.renderTo.appendChild)) {
      options.renderTo = document.body;
    }
    if (typeof options.model !== 'object') {
      options.model = [];
    }
    if (typeof options.nodeClicked !== 'function') {
      options.nodeClicked = undefined;
    }    
    /** @private
     * @member {array} - Nodes that have a depth of 0. Child nodes are available and hierarchical */
   	this._nodes = [];
    /** @private
     * @member {object} - The DOM element to render the TreeList in */
   	this._container = options.renderTo;
    /** @private
     * @member {function} - The callback function to provided that will be called each time a node is clicked */
    this._nodeClicked = options.nodeClicked;
    // Build model (ie build hierarchical nodes) and build ui DOM elements
   	this._buildModel(options.model);
   	this._buildUI();
  }


  /** @method
   * @name destroy
   * @public
   * @memberof TreeList
   * @description <blockquote>TreeList destructor. Will delete each nodes, their events and their properties.</blockquote> */
  destroy() {
    // Destroy model children, they will recursively destroy any existing nodes and listeners
    for (let i = 0; i < this._nodes.length; ++i) {
      this._nodes[i].destroy();
    }
    // Delete object attributes
    Object.keys(this).forEach(key => {
      delete this[key];
    });     
  }


  /*  --------------------------------------------------------------------------------------------------------------- */
  /*  --------------------------------------  TREELIST JS INTERN METHODS  ------------------------------------------  */
  /*                                                                                                                  */
  /*  The following methods are made to build nodes according to the given model, store them and display them.        */
  /*  --------------------------------------------------------------------------------------------------------------- */  


  /** @method
   * @name _buildModel
   * @private
   * @memberof TreeList
   * @description <blockquote>This method will build the TreeList using the provided model. It build the tree nodes recursively,
   * so they match the hierarchical format given as input model.</blockquote>
   * @param {object} model - The model to build the TreeList with. Must match the format described on this component's repository */
	_buildModel(model) {
		for (let i = 0; i < model.length; ++i) {
			this._nodes.push(this._buildNode(model[i], 0));
		}
	}


  /** @method
   * @name _buildNode
   * @private
   * @memberof TreeList
   * @description <blockquote>This method will build the TreeList using the provided model. It build the tree nodes recursively,
   * so they match the hierarchical format given as input model.</blockquote>
   * @param {object} nodeModel - The node model that contains its information
   * @param {number} [nodeModel.id=-1] - The node ID
   * @param {number} nodeModel.name - The node name to display in TreeList
   * @param {array} nodeModel.children - The node children
   * @param {number} depth - The node depth in graph
   * @return {object} The TreeListNode object */
  _buildNode(nodeModel, depth) {
    // No need to pass children since we need full model generation before assigning descendants
    const node = new TreeListNode({
      id: nodeModel.id,
      name: nodeModel.name,
      depth: depth,
      clicked: this._nodeClicked
    });
    // Construct child node if any
    if (nodeModel.children && nodeModel.children.length > 0) {
      for (let i = 0; i < nodeModel.children.length; ++i) {
        node.children.push(this._buildNode(nodeModel.children[i], depth + 1));
      }
    }
    // Set expander only when children have been recursively constructed
    node.setExpander();
    return node;    
  }


  /** @method
   * @name _buildUI
   * @private
   * @memberof TreeList
   * @description <blockquote>This method will attach root nodes (depth 0) to the TreeList UI.</blockquote> */
	_buildUI() {
		this._container.classList.add('tree-list');

		for (let i = 0; i < this._nodes.length; ++i) {
			this._container.appendChild(this._nodes[i].container);
		}
	}


  /*  --------------------------------------------------------------------------------------------------------------- */
  /*  --------------------------------------  TREELIST JS PUBLIC METHOD  -------------------------------------------  */
  /*                                                                                                                  */
  /*  The following methods are made expand all or collapse all nodes in the tree list.                               */
  /*  --------------------------------------------------------------------------------------------------------------- */  


  /** @method
   * @name expandAll
   * @public
   * @memberof TreeList
   * @description <blockquote>This method will expand all nodes in the TreeList recursively.</blockquote> */
  expandAll() {
    for (let i = 0; i < this._nodes.length; ++i) {
      this._nodes[i].expand(true);
    }
  }


  /** @method
   * @name collapseAll
   * @public
   * @memberof TreeList
   * @description <blockquote>This method will collapse all nodes in the TreeList recursively.</blockquote> */
  collapseAll() {
    for (let i = 0; i < this._nodes.length; ++i) {
      this._nodes[i].collapse(true);
    }
  }


};


export default TreeList;
