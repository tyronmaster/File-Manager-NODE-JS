function commandParser(userCommand) {
  let [command, ...args] = userCommand
    .toString()
    .trim()
    .split(' ');

  const quotes = ["\'", "\""];
  args = args.join(' ');

  quotes.forEach((quote, index) => {
    if (args.includes(quote)) {
      args = args
        .split(quote)
        .map(el => el.trim())
        .filter(el => (el.length > 0 && el !== ' '));
    } else if (index === 1) {
      args = args.split(' ');
    }
  })
  return args.length > 2 ? console.error('Wrong parameters. Try to use quotes') : [command, ...args];
}

async function comandValidate(comand, param1, param2) {
  switch (comand) {
    case '.exit':
      process.exit();

    case 'up':
    case 'ls':
      return (!param1 && !param2);

    case 'cd':
    case 'cat':
    case 'add':
    case 'rm':
    case 'hash':
      return (param1 && !param2);

    case 'rn':
    case 'cp':
    case 'mv':
      return (param1 && param2);

    case 'os': {
      const osComands = ['--EOL', '--cpus', '--homedir', '--username', '--architecture'];
      return (osComands.includes(param1) && !param2);
    }

    case 'compress':
    case 'decompress': {
      const param2Condition = param2.slice(param2.lastIndexOf('\\') + 1).includes('.');
      return (param1 && param2 && param2Condition);
    }

    default: return false;
  }
}

export { commandParser, comandValidate };
