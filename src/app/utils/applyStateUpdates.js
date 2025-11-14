// Primary keys used to match nodes when merging arrays of objects.
const indexKeys = ['id', 'key', 'name'];

// Safer object detection than `typeof`.
const isPlainObject = (value) =>
  Object.prototype.toString.call(value) === '[object Object]';

// Only plain objects and arrays are ever merged recursively.
const isMergeable = (value) => Array.isArray(value) || isPlainObject(value);

// Looks for a key shared by the node and the pending updates.
const getMatchingKey = (candidate, remainingKeys) => {
  if (!candidate || typeof candidate !== 'object') {
    return null;
  }
  for (const keyName of indexKeys) {
    const value = candidate[keyName];
    if (value != null && remainingKeys.has(String(value))) {
      return String(value);
    }
  }
  return null;
};

// Prefer a semantic key when possible so array items merge predictably.
const getArrayItemKey = (item, fallback) => {
  if (item && typeof item === 'object') {
    for (const keyName of indexKeys) {
      const value = item[keyName];
      if (value != null) {
        return String(value);
      }
    }
  }
  return fallback;
};

// Merge arrays by aligning items via their derived keys.
const mergeArrays = (target = [], patch = []) => {
  if (!Array.isArray(target)) {
    return Array.isArray(patch) ? [...patch] : patch;
  }
  if (!Array.isArray(patch)) {
    return patch;
  }

  const next = target.slice();
  const lookup = new Map();
  target.forEach((item, index) => {
    lookup.set(getArrayItemKey(item, index), index);
  });

  patch.forEach((patchItem, idx) => {
    const key = getArrayItemKey(patchItem, target.length + idx);
    if (lookup.has(key)) {
      const matchIndex = lookup.get(key);
      next[matchIndex] = mergeNodes(target[matchIndex], patchItem);
    } else {
      next.push(patchItem);
    }
  });

  return next;
};

// Copy-on-write object merge that only clones when something actually changes.
const mergeObjects = (target = {}, patch = {}) => {
  const base = isPlainObject(target) ? target : {};
  let next = base;
  let mutated = false;

  Object.keys(patch).forEach((key) => {
    const patchedValue = mergeNodes(base[key], patch[key]);
    if (patchedValue !== base[key]) {
      if (!mutated) {
        next = { ...base };
        mutated = true;
      }
      next[key] = patchedValue;
    }
  });

  return mutated ? next : base === target ? target : base;
};

// Delegates to the right merge strategy for the node type.
const mergeNodes = (target, patch) => {
  if (patch === undefined) {
    return target;
  }

  if (Array.isArray(patch)) {
    return mergeArrays(target, patch);
  }

  if (isPlainObject(patch)) {
    return mergeObjects(target, patch);
  }

  return patch;
};

// Walk the tree, merging nodes that match keys in `updates`.
export const applyStateUpdates = (tree, updates = {}) => {
  if (!tree || !isPlainObject(updates)) {
    return tree;
  }

  const remainingKeys = new Set(Object.keys(updates));
  if (!remainingKeys.size) {
    return tree;
  }

  const walk = (node) => {
    // Recursively propagate updates until the matching node or array item is found.
    if (!isMergeable(node)) {
      return node;
    }

    if (Array.isArray(node)) {
      let mutated = false;
      const next = node.slice();

      for (let i = 0; i < node.length; i += 1) {
        const candidateKey = getMatchingKey(node[i], remainingKeys);
        let nextValue = node[i];

        if (candidateKey) {
          nextValue = mergeNodes(node[i], updates[candidateKey]);
          remainingKeys.delete(candidateKey);
        } else {
          nextValue = walk(node[i]);
        }

        if (nextValue !== node[i]) {
          next[i] = nextValue;
          mutated = true;
        }

        if (!remainingKeys.size) {
          break;
        }
      }

      return mutated ? next : node;
    }

    let mutated = false;
    let next = node;

    for (const key of Object.keys(node)) {
      let nextValue = node[key];

      if (remainingKeys.has(key)) {
        nextValue = mergeNodes(node[key], updates[key]);
        remainingKeys.delete(key);
      } else {
        nextValue = walk(node[key]);
      }

      if (nextValue !== node[key]) {
        if (!mutated) {
          next = { ...node };
          mutated = true;
        }
        next[key] = nextValue;
      }

      if (!remainingKeys.size) {
        break;
      }
    }

    return next;
  };

  let nextTree = walk(tree);

  if (remainingKeys.size) {
    // Attach updates that never found a match in the existing tree.
    nextTree = nextTree && nextTree !== tree ? { ...nextTree } : { ...(tree || {}) };
    remainingKeys.forEach((key) => {
      nextTree[key] = updates[key];
    });
  }

  return nextTree;
};
