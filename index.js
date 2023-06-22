import { User } from './parsers/User.js';
import { Core } from './parsers/Core.js';

const currentUser = new User();
currentUser.greeting();

process.on('SIGINT', () => currentUser.farewell());
process.on('exit', () => currentUser.farewell());

const app = new Core();
await app.run();

export { currentUser };
