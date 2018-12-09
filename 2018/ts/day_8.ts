
import * as Util    from './util'
import {NumberJSON} from './util'


class Node {
  children :Node[];
  meta     :number[];

  constructor(children :Node[], meta :number[]) {
    this.children = children;
    this.meta     = meta;
  }
}


/*
 *
 * - Consume child_n and meta_len
 * - Enqueue meta_len
 * - Create empty node
 *
 *   if child_n === 0:
 *   - Consume node meta
 *   - Enqueue node in children
 *
 *   if q.node[0] has all children:
 *     - Dequeue child_n
 *     - Dequeue node
 *     - Dequeue children
 *     - Consume meta
 *     - Assign children and meta to node
 *     - Enqueue node as children
 *
 *   else
 *     - Enqueue child_n
 *     - Enqueue empty children array
 *     - Enqueue node
 *
 */

class Parser {
  input :number[];
  q:{
    child_n  :number[],
    meta_len :number[],
    child    :Node[][],
    node     :Node[]
  }

  constructor(input :number[]) {
    this.input = input;
    this.q = {
      child_n  : [],
      meta_len : [],
      child    : [ [] ],
      node     : []
    };
  }

  has_all_children() :boolean {
    return this.q.child[0].length === this.q.child_n[0];
  }

  header() :number[] {
    return this.input.splice(0, 2);
  }

  meta() :number[] {
    return this.input.splice( 0, this.q.meta_len.shift() );
  }

  enqueue(node, children, child_n) {
    this.q.node.unshift(node);
    this.q.child.unshift(children);
  }

  parse() :Node {
    while(this.input.length) {
      const node = new Node([], []);
      const [child_n, meta_len] = this.header();
      this.q.meta_len.unshift(meta_len);


      if( child_n === 0 ) {
        node.meta = this.meta();
        this.q.child[0].unshift(node);

        while( this.has_all_children() ) {
          const node = this.q.node.shift();

          node.children = this.q.child.shift();
          node.meta     = this.meta();

          this.q.child_n.shift();
          this.q.child[0].push(node);
        }
      }
      else {
        this.q.child_n.unshift(child_n);
        this.q.child  .unshift([]);
        this.q.node   .unshift(node);
      }
    }

    return this.q.child[0][0];
  }
}


function format_input(str :string) :number[] {
  return str.split(' ').filter(_=>_).map( _ => parseInt(_) );
}

function first(node :Node) :number {
  return node.meta.concat(
    node.children.map( _node =>
      first(_node)
    )
  )
  .reduce( (acc, n) => acc+n, 0 );
}

function second(node :Node) :number {
  if( !node.children.length )
    return node.meta.reduce( (acc, n) => acc+n, 0 );
  else
    return node.meta.map( n => {
      if( node.children[n-1] )
        return second( node.children[n-1] );
      else
        return 0;
    }).reduce( (acc, n) => acc+n );
}

function main() :void {
  const path  = 'input/day_8.txt';
  const input = format_input( Util.read_file(path) );
  const root  = new Parser(input).parse();

  const _first  = first(root);
  const _second = second(root);
  console.log('First:', _first);
  console.log('Second:', _second);
} 

main();

