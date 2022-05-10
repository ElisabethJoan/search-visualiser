class Node {
    constructor(value) {
        this.value = value;
        this.depth = null;
        this.left = null;
        this.right = null;
    }
}

export default class BalancedBinaryTree {
    constructor(arr) {
        this.root = this.arrayToTree(arr, 0, arr.length - 1, 0);
    }

    arrayToTree(arr, start, end, depth) {
        if (start > end)
        {
            return null;
        }
        
        let mid = parseInt((start + end) / 2);
        let node = new Node(arr[mid]);

        node.depth = depth

        node.left = this.arrayToTree(arr, start, mid - 1, depth+1);
        node.right = this.arrayToTree(arr, mid + 1, end, depth+1);

        return node;
    }

    toNodeArray() {
        let nodeArray = [];

        function preOrderTraversal(node) {
            if (node == null)
            {
                return;
            }

            nodeArray.push(node)
            preOrderTraversal(node.left);
            preOrderTraversal(node.right);
        }

        preOrderTraversal(this.root)

        return nodeArray;
    }
}