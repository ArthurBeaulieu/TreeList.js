import TreeList from '../src/TreeList.js';
import TreeListNode from '../src/TreeListNode.js';
'use strict';


let TreeListTst = null;
const Model = [{
  id: 1,
  name: 'First item',
  children: [{
    id: 3,
    name: 'First sub item',
    children: []
  }, {
    id: 4,
    name: 'Second sub item',
    children: []
  }]
}, {
  id: 2,
  name: 'Second item',
  children: [{
    id: 5,
    name: 'Third sub item',
    children: []
  }]
}];


describe('TreeList unit test', () => {


  it('Component construction with no arguments', done => {
    TreeListTst = new TreeList();
    expect(TreeListTst._nodes).toEqual([]);
    expect(TreeListTst._container).toEqual(document.body);
    expect(TreeListTst._nodeClicked).toEqual(undefined);
    done();
  });


  it('Component construction with wrong arguments', done => {
    TreeListTst = new TreeList({
      renderTo: () => {},
      model: true,
      nodeClicked: 'Not a callback'
    });
    expect(TreeListTst._nodes).toEqual([]);
    expect(TreeListTst._container).toEqual(document.body);
    expect(TreeListTst._nodeClicked).toEqual(undefined);
    done();
  });


  it('Component construction', done => {
    const render = document.createElement('DIV');
    const model = [{ id: 1, name: 'Test', children: [] }];
    const callback = () => { console.log('My callback'); }
    TreeListTst = new TreeList({
      renderTo: render,
      model: model,
      nodeClicked: callback
    });
    expect(TreeListTst._nodes).not.toEqual([]);
    expect(TreeListTst._container).toEqual(render);
    expect(TreeListTst._nodeClicked).toEqual(callback);
    done();
  });


  it('Component destruction', done => {
    TreeListTst = new TreeList();
    TreeListTst.destroy();
    expect(TreeListTst._nodes).toEqual(undefined);
    expect(TreeListTst._container).toEqual(undefined);
    expect(TreeListTst._nodeClicked).toEqual(undefined);
    done();
  });


  it('Private method _buildModel', done => {
    TreeListTst = new TreeList();
    spyOn(TreeListTst, '_buildNode').and.callThrough();
    TreeListTst._buildModel([{ id: 1, name: 'Test', children: [] }]);
    expect(TreeListTst._buildNode).toHaveBeenCalledWith({ id: 1, name: 'Test', children: [] }, 0);
    done();
  });


  it('Private method _buildNode', done => {
    TreeListTst = new TreeList();    
    const node = TreeListTst._buildNode({ id: 1, name: 'Test', children: [] }, 42);
    expect(node._id).toEqual(1);
    expect(node._name).toEqual('Test');
    expect(node._depth).toEqual(42);
    expect(node._clicked).toEqual(undefined);
    expect(node._children).toEqual([]);
    done();
  });


  it('Private method _buildUI', done => {
    TreeListTst = new TreeList({
      renderTo: document.createElement('DIV')
    });    
    TreeListTst._buildUI();
    expect(TreeListTst._container.classList.value).toEqual('tree-list');
    expect(TreeListTst._container.children.length).toEqual(0);
    done();
  });


  it('Public method expandAll', done => {
    TreeListTst = new TreeList({
      renderTo: document.createElement('DIV'),
      model: Model
    });
    TreeListTst.expandAll();
    expect(TreeListTst._nodes[0]._isLeaf).toEqual(false);
    expect(TreeListTst._nodes[0]._isExpanded).toEqual(true);
    expect(TreeListTst._nodes[0]._id).toEqual(1);
    expect(TreeListTst._nodes[0]._name).toEqual('First item');
    expect(TreeListTst._nodes[0]._children[0]._isLeaf).toEqual(true);
    expect(TreeListTst._nodes[0]._children[0]._isExpanded).toEqual(false);
    expect(TreeListTst._nodes[0]._children[0]._id).toEqual(3);
    expect(TreeListTst._nodes[0]._children[0]._name).toEqual('First sub item');
    expect(TreeListTst._nodes[0]._children[1]._isLeaf).toEqual(true);
    expect(TreeListTst._nodes[0]._children[1]._isExpanded).toEqual(false);
    expect(TreeListTst._nodes[0]._children[1]._id).toEqual(4);
    expect(TreeListTst._nodes[0]._children[1]._name).toEqual('Second sub item');    
    expect(TreeListTst._nodes[1]._isLeaf).toEqual(false);
    expect(TreeListTst._nodes[1]._isExpanded).toEqual(true);    
    expect(TreeListTst._nodes[1]._id).toEqual(2);
    expect(TreeListTst._nodes[1]._name).toEqual('Second item');
    expect(TreeListTst._nodes[1]._children[0]._isLeaf).toEqual(true);
    expect(TreeListTst._nodes[1]._children[0]._isExpanded).toEqual(false);
    expect(TreeListTst._nodes[1]._children[0]._id).toEqual(5);
    expect(TreeListTst._nodes[1]._children[0]._name).toEqual('Third sub item');
    expect(TreeListTst._container.children.length).toEqual(2);
    done();
  });  


  it('Public method collapseAll', done => {
    TreeListTst = new TreeList({
      renderTo: document.createElement('DIV'),
      model: Model
    });
    TreeListTst.expandAll();
    TreeListTst.collapseAll();
    expect(TreeListTst._nodes[0]._isLeaf).toEqual(false);
    expect(TreeListTst._nodes[0]._isExpanded).toEqual(false);
    expect(TreeListTst._nodes[0]._id).toEqual(1);
    expect(TreeListTst._nodes[0]._name).toEqual('First item');
    expect(TreeListTst._nodes[1]._isLeaf).toEqual(false);
    expect(TreeListTst._nodes[1]._isExpanded).toEqual(false);    
    expect(TreeListTst._nodes[1]._id).toEqual(2);
    expect(TreeListTst._nodes[1]._name).toEqual('Second item');
    expect(TreeListTst._container.children.length).toEqual(2);
    done();
  });          


});


let TreeListNodeTst = null;


describe('TreeListNode unit test', () => {


  it('Component construction with no arguments', done => {
    TreeListNodeTst = new TreeListNode();
    expect(TreeListNodeTst._id).toEqual(-1);
    expect(TreeListNodeTst._name).toEqual('Invalid model item');
    expect(TreeListNodeTst._depth).toEqual(-1);
    expect(TreeListNodeTst._clicked).toEqual(undefined);
    done();
  });


  it('Component construction with wrong arguments', done => {
    TreeListNodeTst = new TreeListNode({
      id: '42',
      name: 42,
      depth: '42',
      clicked: 'Not a callback'
    });
    expect(TreeListNodeTst._id).toEqual(-1);
    expect(TreeListNodeTst._name).toEqual('Invalid model item');
    expect(TreeListNodeTst._depth).toEqual(-1);
    expect(TreeListNodeTst._clicked).toEqual(undefined);
    done();
  });


  it('Component construction', done => {
    TreeListNodeTst = new TreeListNode({
      id: 42,
      name: 'My node',
      depth: 0,
      clicked: () => {}
    });
    expect(TreeListNodeTst._id).toEqual(42);
    expect(TreeListNodeTst._name).toEqual('My node');
    expect(TreeListNodeTst._depth).toEqual(0);
    expect(typeof TreeListNodeTst._clicked).toEqual('function');
    done();
  });


  it('Component destruction', done => {
    TreeListNodeTst = new TreeListNode({
      id: 42,
      name: 'My node',
      depth: 0,
      clicked: () => {}
    });
    TreeListNodeTst.setExpander();    
    TreeListNodeTst.destroy();
    expect(TreeListNodeTst._id).toEqual(undefined);
    expect(TreeListNodeTst._name).toEqual(undefined);
    expect(TreeListNodeTst._depth).toEqual(undefined);
    expect(TreeListNodeTst._clicked).toEqual(undefined);
    done();
  });


  it('Private method _buildUI', done => {
    TreeListNodeTst = new TreeListNode({
      id: 42,
      name: 'My node'
    });    
    TreeListNodeTst._dom.container = null;
    TreeListNodeTst._dom.label = null;
    TreeListNodeTst._buildUI();
    expect(TreeListNodeTst._dom.container.nodeName).toEqual('DIV');
    expect(TreeListNodeTst._dom.container.classList.value).toEqual('tree-list-node');
    expect(TreeListNodeTst._dom.container.dataset.id).toEqual('42');
    expect(TreeListNodeTst._dom.label.nodeName).toEqual('P');
    expect(TreeListNodeTst._dom.label.innerHTML).toEqual('My node');
    done();
  });      


  it('Private method _onNodeClick', done => {
    TreeListNodeTst = new TreeListNode({
      id: 42,
      name: 'My node',
      depth: 0,
      clicked: node => {
        expect(node.id).toEqual(42);
        expect(node.name).toEqual('My node');
        expect(node.depth).toEqual(0);
        done();
      }
    });
    TreeListNodeTst._onNodeClick();
  });


  it('Private method _onNodeToggle', done => {
    TreeListNodeTst = new TreeListNode();
    TreeListNodeTst._children = [0, 1, 2, 3, 4];
    TreeListNodeTst._isExpanded = true;
    spyOn(TreeListNodeTst, 'collapse').and.callFake(recursive => {
      TreeListNodeTst._isExpanded = false;
      expect(recursive).toEqual(false);
      TreeListNodeTst._onNodeToggle();
    });
    spyOn(TreeListNodeTst, 'expand').and.callFake(recursive => {
      expect(recursive).toEqual(false);
      done();
    });
    TreeListNodeTst._onNodeToggle();
  });  


  it('Public method setExpander', done => {
    TreeListNodeTst = new TreeListNode();
    TreeListNodeTst.setExpander();
    expect(TreeListNodeTst._isLeaf).toEqual(true);
    expect(TreeListNodeTst._dom.expander).toEqual(null);
    expect(TreeListNodeTst._dom.icon).toEqual(null);
    expect(TreeListNodeTst._dom.iconPath).toEqual(null);
    TreeListNodeTst = new TreeListNode();
    TreeListNodeTst._children = [0, 1, 2, 3, 4];
    TreeListNodeTst.setExpander();
    expect(TreeListNodeTst._isLeaf).toEqual(false);
    expect(TreeListNodeTst._dom.expander.nodeName).toEqual('DIV');
    expect(TreeListNodeTst._dom.expander.classList.value).toEqual('vector');
    expect(TreeListNodeTst._dom.icon.nodeName).toEqual('svg');
    expect(TreeListNodeTst._dom.iconPath.nodeName).toEqual('path');        
    done();
  });


  it('Public method expand', done => {
    TreeListNodeTst = new TreeListNode();
    let calls = 0;
    const child = {
      expand: recursive => {
        ++calls;
        expect(recursive).toEqual(true);
      },
      container: document.createElement('DIV')
    };
    TreeListNodeTst._children = [child, child];
    TreeListNodeTst._dom.iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    TreeListNodeTst.expand(true);
    expect(calls).toEqual(2);
    expect(TreeListNodeTst._isExpanded).toEqual(true);
    expect(TreeListNodeTst._dom.iconPath.getAttribute('d')).toEqual(TreeListNodeTst._svgPath.collapse);
    TreeListNodeTst.expand();
    expect(calls).toEqual(2);    
    done();
  });


  it('Public method collapse', done => {
    TreeListNodeTst = new TreeListNode();
    let calls = 0;
    const child = {
      collapse: recursive => {
        ++calls;
        expect(recursive).toEqual(true);
      },
      container: document.createElement('DIV')
    };
    TreeListNodeTst._children = [child, child];
    TreeListNodeTst._dom.iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    TreeListNodeTst._dom.container.removeChild = () => {};
    TreeListNodeTst.collapse(true);
    expect(calls).toEqual(2);
    expect(TreeListNodeTst._isExpanded).toEqual(false);
    expect(TreeListNodeTst._dom.iconPath.getAttribute('d')).toEqual(TreeListNodeTst._svgPath.expand);
    TreeListNodeTst.collapse();
    expect(calls).toEqual(2);
    done();
  });   


  it('Public method expandAll', done => {
    TreeListNodeTst = new TreeListNode();
    spyOn(TreeListNodeTst, 'expand').and.callFake(recursive => {
      expect(recursive).toEqual(true);
      done();
    });
    TreeListNodeTst.expandAll();
  });


  it('Public method collapseAll', done => {
    TreeListNodeTst = new TreeListNode();
    spyOn(TreeListNodeTst, 'collapse').and.callFake(recursive => {
      expect(recursive).toEqual(true);
      done();
    });
    TreeListNodeTst.collapseAll();
  });  


});
