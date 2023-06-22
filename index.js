import { User } from './structures/User.js';
import { Core } from './structures/Core.js';

const currentUser = new User();
currentUser.greeting();

process.on('SIGINT', () => currentUser.farewell());
process.on('exit', () => currentUser.farewell());

const app = new Core();
await app.run();

export { currentUser };
