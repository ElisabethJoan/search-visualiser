class Node {
    constructor(value) {
        this.value = value;
        this.depth = null;
        this.left = null;
        this.right = null;
        this.isGoal = false;
        this.isPath = false;
        this.isActive = false;
        this.idx = null;
    }
}

export default class BalancedBinaryTree {
    constructor(arr) {
        this.root = this.arrayToTree(arr, 0, arr.length - 1, 0);
        this.index = 0
    }

    arrayToTree(arr, start, end, depth) {
        if (start > end) {
            return null;
        }
        
        let mid = parseInt((start + end) / 2);
        let node = new Node(arr[mid]);

        node.depth = depth;

        node.left = this.arrayToTree(arr, start, mid - 1, depth + 1);
        node.right = this.arrayToTree(arr, mid + 1, end, depth + 1);

        return node;
    }

    async toNodeArray() {
        let nodeArray = [];

        function breadthFirstTraversal(node, depth) {
            if (node === null) {
                return;
            }
            if (depth === 1) {
                nodeArray.push(node);
            } else if (depth > 1) {
                breadthFirstTraversal(node.left, depth - 1);
                breadthFirstTraversal(node.right, depth - 1);
            }
        }

        for (let i = 1; i <= 4; i++) {
            breadthFirstTraversal(this.root, i);
        }

        return nodeArray;
    }
}