type stringLike = { toString: () => string };

function groupBy<T, U extends stringLike>(
  items: Array<T>,
  grouper: (item: T) => U | void
) {
  const groups: { [key: string]: Array<T> } = {};
  items.forEach((item) => {
    const result = grouper(item);
    const group = result ? result.toString() : "";
    groups[group] = groups[group] || [];
    groups[group].push(item);
  });

  return groups;
}

export default groupBy;
