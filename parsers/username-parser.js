function parseUserName() {
    const userNameArgument = process.argv
        .slice(2, 3) // prevent other argument parsing as username
        .toString()
        .trim()
        .split('--username=')[1]; // prevent situation when name includes '='
    return userNameArgument;
}

function greeting(name) {
    const USERNAME = name.length ? name : 'Guy Fox';
    process.stdout.write(`Welcome to the File Manager, ${USERNAME}!\n`);
}
export { parseUserName, greeting };