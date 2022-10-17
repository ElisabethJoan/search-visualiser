// --------------- SEARCHES ---------------
async function dfs(node) {
    let visited = [];
    let path = [];

    async function local(node) {
        if (node === null) {
            return false;
        } else {
            visited.push(node);
        }

        if (node.isGoal === true) {
            path.push(node);
            return true;
        }

        if (await local(node.left)) {
            path.push(node);
            return true;
        }

        if (node.left !== null && node.right !== null) {
            visited.push(node);
        }

        if (await local(node.right)) {
            path.push(node);
            return true;
        }

        if (node.left !== null && node.right !== null) {
            visited.push(node);
        }
    }
    await local(node);

    return [visited, path];
}

async function bfs(root) {
    if (root === null) {
        return;
    }

    let queue = [[root, [root]]];
    let explored = [];

    while (queue.length > 0) {
        let [node, path] = queue[0];

        if (node.isGoal === true) {
            explored.push(node);
            break;
        }

        if (node.left !== null) {
            queue.push([node.left, path.concat([node.left])]);
        }

        if (node.right !== null) {
            queue.push([node.right, path.concat([node.right])]);
        }

        explored.push(queue.shift()[0]);
    }

    return [explored, queue[0][1].reverse()];
}


async function binarySearch(tree, goal) {
    let path = [];
    
    let temp = structuredClone(tree)
    temp.sort(function (a, b) {
        return a.value - b.value;
    });

    async function inner(nodes, l, r, goal) {
        if (r >= l) {
            let mid = l + Math.floor((r - l) / 2);
            path.push(nodes[mid])
     
            if (nodes[mid].value === goal.value) {
                return mid;
            }

            if (nodes[mid].value > goal.value) {
                return inner(nodes, l, mid - 1, goal);
            }

            return inner(nodes, mid + 1, r, goal);
        }
     
        return false;
    }

    await inner(temp, 0, tree.length - 1, goal)

    let nodes = [];
    tree.forEach((node) => {
        path.forEach((tempNode) => {
            if (node.value === tempNode.value) {
                nodes.push(node);
            }
        })
    })

    return [nodes];
}

// --------------- TRAVERSALS ---------------
async function preOrderTraversal(node) {
    let visited = [];

    async function dfs(node) {
        if (node === null) {
            return false;
        }

        visited.push(node);

        if (await dfs(node.left)) {
            return true;
        }
        if (await dfs(node.right)) {
            return true;
        }
    }

    await dfs(node);

    return [visited];
}

async function inOrderTraversal(node) {
    let visited = [];

    async function dfs(node) {
        if (node === null) {
            return false;
        }

        if (await dfs(node.left)) {
            return true;
        }

        visited.push(node);

        if (await dfs(node.right)) {
            return true;
        }
    }

    await dfs(node);

    return [visited];
}

async function postOrderTraversal(node) {
    let visited = [];

    async function dfs(node) {
        if (node === null) {
            return false;
        }

        if (await dfs(node.left)) {
            return true;
        }

        if (await dfs(node.right)) {
            return true;
        }

        visited.push(node);
    }

    await dfs(node);

    return [visited];
}

async function levelOrderTraversal(node) {
    let visited = [];

    async function lot(node, depth) {
        if (node === null) {
            return;
        }
        if (depth === 1) {
            visited.push(node);
        } else if (depth > 1) {
            await lot(node.left, depth - 1);
            await lot(node.right, depth - 1);
        }
    }

    for (let i = 1; i <= 4; i++) {
        await lot(node, i);
    }

    return [visited];
}

// --------------- CHALLENGES ---------------
// https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/
async function verticalOrderTraversal(node) {
    let visited = [];

    const findInsertPositionForLevel = (elements, level, insertValue) => {
        let insertAt = null;
        let index = elements.length - 1;

        while (index >= 0 && elements[index][1] === level &&
          elements[index][0] > insertValue) {
            insertAt = index;
            index--;
        }

        return insertAt;
    };

    async function verticalSort(node) {
        const lookup = new Map();
        const queue = [[node, 0, 0]];
        let leftMin = Infinity;
        let rightMax = -Infinity;

        while (queue.length) {
            const [node, distance, level] = queue.shift();

            !lookup.has(distance) && lookup.set(distance, []);
            const elements = lookup.get(distance);
            const insertAt = findInsertPositionForLevel(elements, level, node.value);
            const insertAtEnd = typeof insertAt !== "number";
            const nodeToInsert = [node, level];
            insertAtEnd
                ? elements.push(nodeToInsert)
                : elements.splice(insertAt, 0, nodeToInsert);

            if (node.left) {
                queue.push([node.left, distance - 1, level + 1]);
            }

            if (node.right) {
                queue.push([node.right, distance + 1, level + 1]);
            }

            leftMin = Math.min(leftMin, distance);
            rightMax = Math.max(rightMax, distance);
        }

        for (let distance = leftMin; distance <= rightMax; distance++) {
            let temp = lookup.get(distance)
            for await (const element of temp) {
                visited.push(element[0]);
            }
        }
    }

    await verticalSort(node);

    return visited;
}

// https://leetcode.com/problems/binary-tree-level-order-traversal-ii/
async function reverseLOT(node) {
    let visited = [];

    async function lot(node, depth) {
        if (node === null) {
            return;
        }
        if (depth === 1) {
            visited.push(node);
        } else if (depth > 1) {
            await lot(node.left, depth - 1);
            await lot(node.right, depth - 1);
        }
    }

    for (let i = 4; i > 0; i--) {
        await lot(node, i);
    }

    return visited;
}

// https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/
async function zigZagLOT(node) {
    let visited = [];

    async function zigzagL(node, depth) {
        if (node === null) {
            return;
        }
        if (depth === 1) {
            visited.push(node);
        } else if (depth > 1) {
            await zigzagL(node.left, depth - 1);
            await zigzagL(node.right, depth - 1);
        }
    }

    async function zigzagR(node, depth) {
        if (node === null) {
            return;
        }
        if (depth === 1) {
            visited.push(node);
        } else if (depth > 1) {
            await zigzagR(node.right, depth - 1);
            await zigzagR(node.left, depth - 1);
        }
    }

    for (let i = 1; i <= 4; i++) {
        if (i % 2 === 1) {
            await zigzagL(node, i);
        } else {
            await zigzagR(node, i);
        }
    }

    return visited;
}

export {
    dfs, bfs, binarySearch, preOrderTraversal, inOrderTraversal, postOrderTraversal,
    levelOrderTraversal, verticalOrderTraversal, reverseLOT, zigZagLOT
};