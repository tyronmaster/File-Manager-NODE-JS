import { User } from './parsers/User.js';
import { Core } from './parsers/Core.js';

const currentUser = new User();
currentUser.greeting();

const app = new Core();
await app.run();

process.on('SIGINT', () => currentUser.farewell());
process.on('exit', () => currentUser.farewell());

export { currentUser };
