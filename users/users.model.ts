const users = [
  { name: "guelfi", email: "fabioguelfunix@gmail.com" },
  { name: "ricardo", email: "ricardo@gmail.com" }
];

export class User {
  static findAll(): Promise<any[]> {
    return Promise.resolve(users);
  }
}
