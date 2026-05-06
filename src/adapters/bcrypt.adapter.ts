import * as bcrypt from "bcrypt";

export class BcryptAdapter {
  private readonly salt = 10;

  public async generateHash(password: string): Promise<string> {
    return bcrypt.hash(password, this.salt);
  }

  public async compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}