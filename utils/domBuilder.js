function createNode(node) {
    return document.createElement(node);
}

function append(parent, child) {
    parent.appendChild(child);
}

export {createNode, append};
