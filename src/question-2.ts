type Func = ((...args: any[]) => any) & { defaultArgNames?: string[] };
type Args = { [key: string]: any };

function defaultArguments(fn: Func, params: Args): Func {
  // considering the case of repeatly calling defaultArguments to change the defaults
  // we need to store the first default arguments' name
  // retrieve arguments' name if already existing (and mean it's repeated firing) OR get it from getParams(fn) helper
  let argNames = fn.defaultArgNames ?? getParams(fn);
  const defaultFunction = function (...args: any[]) {
    for (let i = 0; i < argNames.length; i++) {
      if (args[i] === undefined && params.hasOwnProperty(argNames[i])) {
        // When not receiving specific param data from actual execution
        // AND has matched default argument
        // THEN assign the current argument key's value by matched default argument
        args[i] = params[argNames[i]];
      }
    }

    return fn.apply(null, args);
  };

  defaultFunction.defaultArgNames = argNames;
  return defaultFunction;
}

function getParams(func: Func): string[] {
  let str = func.toString();

  // remove comments of the form /* ... */
  // removing comments of the form //
  // remove body of the function { ... }
  // removing '=>' if func is arrow function
  str = str
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/(.)*/g, "")
    .replace(/{[\s\S]*}/, "")
    .replace(/=>/g, "")
    .trim();

  // start parameter names after first '('
  const startIndex = str.indexOf("(") + 1;
  // end parameter names is just before last ')'
  const endIndex = str.length - 1;
  const result = str.substring(startIndex, endIndex).split(", ");
  let params: string[] = [];

  result.forEach((element) => {
    // removing any default value. E.g. doSomething(a = 1, b = 2)
    element = element.replace(/=[\s\S]*/g, "").trim();
    if (element.length > 0) {
      params.push(element);
    }
  });

  return params;
}

function add(a: number, b: number): number {
  return a + b;
}

const add2 = defaultArguments(add, { b: 9 });
console.assert(add2(10) === 19);
console.log(add2(10) === 19);
console.assert(add2(10, 7) === 17);
console.log(add2(10, 7) === 17);
console.assert(isNaN(add2()));
console.log(isNaN(add2()));

const add3 = defaultArguments(add2, { b: 3, a: 2 });
console.assert(add3(10) === 13);
console.assert(add3() === 5);

const add4 = defaultArguments(add, { c: 3 }); // doesn't do anything
console.assert(isNaN(add4(10)));
console.assert(add4(10, 10) === 20);

const add5 = defaultArguments(add2, { a: 10 }); //extends add2
console.assert(add5() === 19); // a=10, b=9
console.log(add5() === 19); // a=10, b=9
