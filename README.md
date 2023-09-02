## Decorators Parser

### License
© 2023 Smartschool Inc. All rights reserved.

### Installation guide
1. Install NodeJS 18 or newer from [https://nodejs.org/en/download](https://nodejs.org/en/download)
2. Add NodeJS to PATH - [example guide](https://www.tutorialspoint.com/nodejs/nodejs_environment_setup.htm)
3. Run `npm install "decorators-parser-js"` in your command line


### API
#### parse
```js
function parse(file, data)
```
Parses given string or file and returns a list of dictionaries. If both `file` and `data` are provided, `data` will be ignored.

#### constructor
```js
function constructor(constraints={}, ignored=[])
```
Creates a new Parser object. `constraints` is a dictionary of constraints for decorators. `ignored` is a list of decorators to ignore.

### Decorators format
Decorator name can be any string that does not contain '@' character. If decorator
does not satisfy this requirement `InvalidDecoratorException` will be thrown.

#### Example:
```
@decorator(some nice value)
```

### Standard decorators
Decorators can be used in one of three ways:
```
@decorator(value)
```
or
```
@decorator()
Some very long and complicated value that would be hard to read if it were in parenthesis like the value above.
```
or
```
@decorator
Some very long and complicated value that would be hard to read if it were in parenthesis like the value above.
```

All of these create Javascript dictionary like this:
```js
{
    'decorator': 'value'
}
```

### @new decorator

Using @new decorator starts a new dictionary and adds it to the current list of dictionaries. In a single piece of text between two @new decorators (which correspond to a single JavaScript dictionary) there can not be two decorators with the same name. Using a same name without an appropriate @new decorator will result in `DuplicateDecoratorException` being thrown.

#### Example:
task.txt:
```
@question()
Who is Lincoln?

@new
@question()
What is the purpose of the Bill of Rights?
```

run.js:
```js
import { Parser } from "decorators-parser-js"
let task_parser = new Parser()
console.log(task_parser.parse('task.txt'))
```

result:
```js
[
    {
        'question': 'Who is Lincoln?'
    },
    {
        'question': 'What is the purpose of the Bill of Rights?'
    }
]
```
### Global decorators

In addition to standard decorators, decorators which name starts with `global-` are added to each dictionary while parsing a file. Dictionary key is the decorator's suffix after `global-` 

#### Example:
task.txt:
```
@global-topic(History)
@question()
Who is Lincoln?

@new
@question()
What is the purpose of the Bill of Rights?
```

run.js:
```js
import { Parser } from "decorators-parser-js"
let task_parser = new Parser()
console.log(task_parser.parse('task.txt'))
```

result:
```js
[
    {
        'topic': 'History',
        'question': 'Who is Lincoln?'
    },
    {
        'topic': 'History',
        'question': 'What is the purpose of the Bill of Rights?'
    }
]
```

### Constraints

Decorators can use constraints on their values. If a decorator has value that does not match regular expression
provided, Parser will throw `InvalidValueException`. Parser class takes optional `constraints` argument in its constructor which
is a JavaScript dictionary in a format shown below (if format of the given dictionary is invalid, `InvalidConstraintException` will be thrown):
```js
let example = {
    'question': 
    {
        'regex': '^([^@]+)$',
        'description': 'any non-empty string without @'
    },
    'correct':
    {
        'regex': '^([1-4])$',
        'description': 'any number from 1 to 4'
    }
}
```


#### Example 1

task.txt:
```
@correct(11)
```

run.js:
```js
import { Parser } from "decorators-parser-js"
let task_parser = new Parser(example)
console.log(task_parser.parse('task.txt'))
```

Will result in the following output:
```
InvalidValueException [Error]: 'correct' should be any number from 1 to 4 but is 11
```

#### Example 2
If we take Example 1 but change task.txt file to:
```
correct(1)
```

The output will be:
```js
[
    {
        'correct': '1'
    }
]
```

### Ignored decorators

If you need to use @ symbol for something else than decorator, you can specify
names to exclude from the search

#### Example:
task.txt:
```
@question
Some long question with @ref in it
```

run.js:
```js
import { Parser } from "decorators-parser-js"
let task_parser = new Parser({}, ["ref"])
console.log(task_parser.parse('task.txt'))
```

Will result in the following output:
```js
[
    {
        'question': 'Some long question with @ref in it'
    }
]
```