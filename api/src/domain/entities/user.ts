export class User {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string | undefined,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(
    id: string,
    name: string,
    email: string,
    password: string | undefined,
    createdAt: Date,
    updatedAt: Date,
  ) {
    const user = new User(id, name, email, password, createdAt, updatedAt);
    return user;
  }

  static update(user: User, data: Partial<User>) {
    return new User(
      user.id,
      data.name ?? user.name,
      data.email ?? user.email,
      data.password ?? user.password,
      user.createdAt,
      new Date(),
    );
  }
}
