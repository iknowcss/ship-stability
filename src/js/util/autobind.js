export default function autobind(obj) {
  for (let name of Object.getOwnPropertyNames(Object.getPrototypeOf(obj))) {
    let method = obj[name]
    if (!(method instanceof Function) || method === obj.constructor) continue
    obj[name] = method.bind(obj)
  }
}
