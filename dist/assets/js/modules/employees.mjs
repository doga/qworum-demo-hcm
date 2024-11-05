import { User } from "./user.mjs";

const 
filePath        = '/data/employees.json',
localStorageKey = 'employees';

class Employee {
  /**
   * @param {string} id employee ID
   * @param {User} user
   * @param {(string|null|undefined)} supervisorId
   */
  constructor(id, user, supervisorId) {
    this.id            = id;
    this.user          = user;
    this.supervisorId = supervisorId || null;
  }
  toJSON(){
    return ({id: this.id, user: this.user.toJSON(), supervisor_id: this.supervisorId});
  }
}

class Employees {
  /**
   * @type {Employee[]}
   */
  employees = [];

  /**
   * @return {Employees}
   * @static
   * @async
   */
  static async read() {
    // console.debug(`reading localStorage`);
    // try localStorage
    let data = localStorage.getItem(localStorageKey);
    if (data) {
      data = JSON.parse(data);
      return new Employees(data);
    }

    // fetch the file
    // console.debug(`reading file`);
    const response = await fetch(filePath);
    data = await response.json();

    return new Employees(data);
  }

  constructor(data) {
    if(!data) data = [];
    for (const d of data)
    this.employees.push(
      new Employee(
        d.id,
        new User(d.user.id, d.user.name), // TODO pass JS object as argument
        d.supervisor_id
      )
    );
  }

  /**
   * @param {(Employee|null|undefined)} supervisor
   * @returns {Promise<Employee[]>}
   */
  withSupervisor(supervisor){
    // console.debug(`[forUser] userId:`, userId);
    const supervisedEmployees = this.employees.filter(e => (e.supervisorId || null) === (supervisor?.id || null));

    // console.debug(`[withSupervisor] allEmployees:`, this.employees);
    // console.debug(`[withSupervisor] supervisedEmployees:`, supervisedEmployees);
    // console.debug(`[forUser] userproj:`, userEmployees);
    return supervisedEmployees;
  }

  /**
   * @param {User} user
   * @returns {<(Employee|null)>}
   */
  findByUser(user){
    const employee = this.employees.find(e => e.user.id === user.id) || null;
    return employee;
  }

  /**
   * @param {string} employeeId
   * @returns {<(Employee|null)>}
   */
  byEmployeeId(employeeId){
    return this.employees.find(e => e.id === employeeId) || null;
  }

  write(){
    localStorage.setItem(localStorageKey, JSON.stringify(this));
  }
  toString(){
    return `Employees([${this.employees.map(e => e.toString()).join(', ')}])`;
  }
  toJSON(){
    return this.employees.map(e => e.toJSON());
  }
}

export {Employee, Employees};
