'use strict';


class TreeListNode {


  /** @summary Create a node for the TreeList
   * @author Arthur Beaulieu
   * @since October 2020
   * @description <blockquote>This class is made to create each node in the TreeList. Nodes are build recursively and stored in 
   * a child nodes array. Each node contains identification information, among other useful values ; depth in tree, expand state
   * and leaf state. They also hold any mouse interaction the user could have on the node. Finally, those nodes are expandable/collapsable
   * if they contain child nodes.</blockquote>
   * @param {object} options - The node options
   * @param {number} [options.id=-1] - The element ID, must be provided in model input object 
   * @param {string} options.name - The node name, mandatory as it is the <code>innerHTML</code> content 
   * @param {number} options.depth - The node depth in tree list, mandatory as it is the <code>innerHTML</code> content 
   * @param {function} [options.clicked] - The callback function to provided that will be called each time the node is clicked */
	constructor(options = {}) {
    // Prevent wrong type for arguments, fallback according to attribute utility
    if (typeof options.id !== 'number') {
      options.id = -1;
    }
    if (typeof options.name !== 'string') {
      options.name = 'Invalid model item';
    }
    if (typeof options.depth !== 'number') {
      options.depth = -1;
    }
    if (typeof options.clicked !== 'function') {
      options.clicked = undefined;
    }     
    /** @private
     * @member {number} - The node ID */
		this._id = options.id;
    /** @private
     * @member {string} - The node name to display */		
		this._name = options.name;
    /** @private
     * @member {number} - The node depth in graph */		
		this._depth = options.depth;
    /** @private
     * @member {function} - The callback function to call when node is clicked */		
		this._clicked = options.clicked;
		// Node flags for leaf type or expand state		
    /** @private
     * @member {boolean} - The leaf state of node */		
		this._isLeaf = false;
    /** @private
     * @member {boolean} - The expand state of node */
		this._isExpanded = false;
		// Children must be build later, in caller side with setExpander() method
    /** @private
     * @member {array} - The node children */
		this._children = [];
		// TreeListNode DOM elements
    /** @private
     * @member {object} - The node DOM elements */		
		this._dom = {
			container: null,
			label: null,
			expander: null,
			icon: null,
			iconPath: null
		};
		// Collapse/Expand svg pathes
    /** @private
     * @member {object} - Expand/Collapse icon svg pathes */		
		this._svgPath = {
			expand: 'M 15.000348,6.2497966 H 8.7502034 V -3.4865e-4 H 6.2501452 V 6.2497966 H 0 V 8.7498548 H 6.2501452 V 15 H 8.7502034 V 8.7498548 h 6.2501446 z',
			collapse: 'M 0,6.2493128 H 15.004124 V 8.7506872 H -0.0041235 z'
		};
		// Event binding for proper remove listener on destroy node
		this._onNodeClick = this._onNodeClick.bind(this);
		this._onNodeToggle = this._onNodeToggle.bind(this);
		// Build the node DOM with its internal info
		this._buildUI();
	}


  /** @method
   * @name destroy
   * @public
   * @memberof TreeListNode
   * @description <blockquote>TreeListNode destructor. Will delete node and its children, their events and their properties.</blockquote> */
	destroy() {
		// Call destroy method on each child node
		for (let i = 0; i < this._children.length; ++i) {
			this._children[i].destroy();
		}
		// Remove click listener
		this._dom.label.removeEventListener('click', this._onNodeClick, false);
		// On node toggle is only listened if node is expandable/collapsable
		if (!this._isLeaf) {
			this._dom.expander.removeEventListener('click', this._onNodeToggle, false);
		}
    // Delete object attributes
    Object.keys(this).forEach(key => {
      delete this[key];
    });		
	}


  /*  --------------------------------------------------------------------------------------------------------------- */
  /*  ------------------------------------  TREELISTNODE JS INTERN METHODS  ----------------------------------------  */
  /*                                                                                                                  */
  /*  The following methods are made to build node and make them interactive.                                         */
  /*  --------------------------------------------------------------------------------------------------------------- */ 


  /** @method
   * @name _buildUI
   * @private
   * @memberof TreeListNode
   * @description <blockquote>This method will build the node DOM element and fill their attributes.</blockquote> */
	_buildUI() {
		// Create node DOM elements
		this._dom.container = document.createElement('DIV');
		this._dom.label = document.createElement('P');
		// Update node DOM internal attributes
		this._dom.container.classList.add('tree-list-node');
		this._dom.container.dataset.id = this._id;
		this._dom.label.innerHTML = this._name;
		// React to event and append to DOM
		this._dom.label.addEventListener('click', this._onNodeClick, false);
		this._dom.container.appendChild(this._dom.label);
	}


  /** @method
   * @name _onNodeClick
   * @private
   * @memberof TreeListNode
   * @description <blockquote>This method is called on click event on the node container. It will call the given callback
   * if any was provided.</blockquote> */
	_onNodeClick() {
		// Only fire callback if one has been provided
		if (typeof this._clicked === 'function') {
			this._clicked({
				id: this._id,
				name: this._name,
				depth: this._depth,
				isLeaf: this._isLeaf,
				isExpanded: this._isExpanded
			});
		}
	}


  /** @method
   * @name _onNodeToggle
   * @private
   * @memberof TreeListNode
   * @description <blockquote>This method will collapse or expand node only if it has children.</blockquote> */
	_onNodeToggle() {
		// Only toggle if node has children
		if (this._children.length > 0) {
			if (this._isExpanded) { // Collapse node
				this.collapse(false);
			} else { // Expand node
				this.expand(false);
			}
		}
	}


  /*  --------------------------------------------------------------------------------------------------------------- */
  /*  --------------------------------------  TREELIST JS PUBLIC METHOD  -------------------------------------------  */
  /*                                                                                                                  */
  /*  The following methods are made expand all or collapse all nodes in the tree list.                               */
  /*  --------------------------------------------------------------------------------------------------------------- */


  /** @method
   * @name setExpander
   * @public
   * @memberof TreeListNode
   * @description <blockquote>This method will append an expander to the node only if it has children. It must be called
   * we all the TreeList is created, since it is recursive. See TreeList implementation.</blockquote> */
	setExpander() {
		if (this._children.length === 0) { // No children, no expander
			this._isLeaf = true;
		} else { // Create expander for node
			// Icon DOM elements
			this._dom.expander = document.createElement('DIV');
			this._dom.icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			this._dom.iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			// Update icon elements attributes
			this._dom.expander.classList.add('vector');
			this._dom.iconPath.setAttribute('d', this._svgPath.expand);
    	this._dom.iconPath.setAttribute('fill', '#000000');
    	// react to toggle event and append icon elements to the node container
			this._dom.expander.addEventListener('click', this._onNodeToggle, false);
  		this._dom.icon.appendChild(this._dom.iconPath);
  		this._dom.expander.appendChild(this._dom.icon);
			this._dom.container.insertBefore(this._dom.expander, this._dom.container.firstChild); // Insert before to put it first
		}
	}


  /** @method
   * @name expand
   * @public
   * @memberof TreeListNode
   * @description <blockquote>This method will expand the node only if it has children. The expand can be recursiv through the
   * node children if given flag is provided.</blockquote>
   * @param {boolean} [recursive=false] - Propagate the expand call through each children of this node */
	expand(recursive = false) {
		if (this._children.length > 0) {
			this._dom.iconPath.setAttribute('d', this._svgPath.collapse);
			// Append children into node container
			for (let i = 0; i < this._children.length; ++i) {
				// Call expand on children and pass recursive flag
				if (recursive) {
					this._children[i].expand(recursive);
				}
				// Append child from DOM container
				this._dom.container.appendChild(this._children[i].container);
			}
			// Update expand flag
			this._isExpanded = true;
		}
	}


  /** @method
   * @name collapse
   * @public
   * @memberof TreeListNode
   * @description <blockquote>This method will collapse the node only if it has children. The collapse can be recursiv through the
   * node children if given flag is provided.</blockquote>
   * @param {boolean} [recursive=false] - Propagate the collapse call through each children of this node */
	collapse(recursive = false) {
		if (this._children.length > 0) {
			this._dom.iconPath.setAttribute('d', this._svgPath.expand);
			// Remove children from node container
			for (let i = 0; i < this._children.length; ++i) {
				// Call collapse on children and pass recursive flag
				if (recursive) {
					this._children[i].collapse(recursive);
				}
				// Remove child from DOM container
				this._dom.container.removeChild(this._children[i].container);
			}
			// Update expand flag
			this._isExpanded = false;
		}
	}


  /** @method
   * @name expandAll
   * @public
   * @memberof TreeListNode
   * @description <blockquote>This method will expand all nodes starting from this node.</blockquote> */
	expandAll() {
		// Recursively expand node
		this.expand(true);
	}


  /** @method
   * @name collapseAll
   * @public
   * @memberof TreeListNode
   * @description <blockquote>This method will collapse all nodes starting from this node.</blockquote> */
	collapseAll() {
		// Recursively collapse node
		this.collapse(true);
	}


  /** @public
   * @member {array} - The node children */
	get children() { return this._children; }


  /** @public
   * @member {object} - The node DOM container */
	get container() { return this._dom.container; }


};


export default TreeListNode;
