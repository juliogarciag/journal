import identity from "./identity";

function times(n, transform = identity) {
  const array = [];
  for (let i = 0; i < n; i++) {
    array.push(transform(i));
  }
  return array;
}

export default times;
