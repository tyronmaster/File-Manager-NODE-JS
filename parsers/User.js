/* eslint-disable import/prefer-default-export */
class User {
  constructor() {
    const userNameArgument = process.argv
      .slice(2, 3) // prevent other argument parsing as username
      .toString()
      .trim()
      .split('--username=')[1]; // prevent situation when name includes '='
    this.username = userNameArgument.length ? userNameArgument : 'Guy Fox';
  }

  greeting() {
    process.stdout.write(`Welcome to the File Manager, ${this.username}!\n`);
  }

  farewell() {
    process.stdout.write(`Thank you for using File Manager, ${this.username}, goodbye!\n`);
    process.exit();
  }
}

export { User };
