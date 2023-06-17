function fixPath(pathFromArgs) {
  let pathToFix = pathFromArgs;
  // fix bug when entered argument is "d:" without "\"
  if (pathToFix.trim().match(/^[a-z]:/gi) && pathToFix.length === 2) {
    pathToFix += '\\';
  }
  return pathToFix;
}

function commandParser(userCommand) {
  let [command, ...args] = userCommand
    .toString()
    .trim()
    .split(' ');
  const quotes = ["\'", "\""];
  args = args.join(' ');
  quotes.forEach(( quote, index) => {
    if (args.includes(quote)) {
      args = args
        .split(quote)
        .map(el => el.trim())
        .filter(el => (el.length > 0 && el !== ' '));
    } else if(index === 1){
      args = args.split(' ');
    }
  })
  return args.length > 2 ? console.error('Wrong parameters. Try to use quotes') : [command,...args];
}

async function comandValidate(comand, param1, param2) {
  switch (comand) {
    case '.exit': {
      // currentUser.farewell();
      process.exit();
      // return false;
    }
    case 'up': {
      return (!param1 && !param2);
    }
    case 'cd': {
      return (param1.length > 1 && !param2);
    }
    case 'ls': {
      return (!param1 && !param2);
    }
    case 'cat': {
      return (param1 && !param2);
    }
    case 'add': {
      return (param1 && !param2);
    }
    case 'rn': {
      return (param1 && param2.length > 1);
    }
    case 'cp': {
      return (param1 && param2);
    }
    case 'mv': {
      return (param1 && param2);
    }
    case 'rm': {
      return (param1 && !param2);
    }
    case 'os': {
      const osComands = ['--EOL', '--cpus', '--homedir', '--username', '--architecture'];
      return (osComands.includes(param1) && !param2);
    }
    case 'hash': {
      return (param1 && !param2);
    }
    case 'compress': {
      return (param1 && param2);
    }
    case 'decompress': {
      return (param1 && param2);
    }
    default: return false;
  }
  // return false;
}

export { commandParser, comandValidate };
