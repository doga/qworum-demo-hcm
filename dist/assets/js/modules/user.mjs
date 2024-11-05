
class User {
  /**
   * @param {string} id
   * @param {string} name
   */
  constructor(id, name) {
    // console.debug(`new User`,id,name);
    this.id   = id;
    this.name = name;
  }
  toString(){
    return `User(id: ${this.id}, name: ${this.name})`;
  }
  toJSON(){
    return ({id: this.id, name: this.name});
  }
}

export {User};
