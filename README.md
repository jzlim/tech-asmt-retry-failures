# Question 1 - retryFailures

Implement an asynchronous function `retryFailures` which accepts two parameters:

1. An asynchronous `target function` to call
2. A number of `retries` it will make


Your function will have to keep calling `target function` until it resolves to a value or number of retries reaches `retries` parameter. Upon reaching max number of `retries` allowed, `retryFunction` should throw last error thrown by `target function`.

```javascript
async function retryFailures<T>(fn: () => Promise<T>, retries: number): Promise<T> {
  // your code here
}

function createTargetFunction(succeedsOnAttempt: number) {
  let attempt = 0;

  return async () => {
    if (++attempt === succeedsOnAttempt) {
      return attempt;
    }

    throw Object.assign(new Error(`failure`), { attempt });
  };
}
```


# Question 2 - defaultArguments

Write a function `defaultArguments`. It takes a function as an argument, along with an object containing default values for that function's arguments, and returns another function which defaults to the right values.

## Requirements
- You cannot assume that the function's arguments have any particular names.
- You should be able to call `defaultArguments` repeatedly to change the defaults.

## Example
```javascript
function add(a, b) {
  return a + b;
};

const add2 = defaultArguments(add, { b: 9 });
console.assert(add2(10) === 19);
console.assert(add2(10, 7) === 17);
console.assert(isNaN(add2()));

const add3 = defaultArguments(add2, { b: 3, a: 2 });
console.assert(add3(10) === 13);
console.assert(add3() === 5);

const add4 = defaultArguments(add, { c: 3 }); // doesn't do anything
console.assert(isNaN(add4(10)));
console.assert(add4(10, 10) === 20);

const add5 = defaultArguments(add2, { a: 10 }); //extends add2
console.assert(add5() === 19); // a=10, b=9
```


# Question 3 - defaultArguments

The businessmen among you will know that it's often not easy to ﬁnd an appointment. In this task we want to ﬁnd such an appointment automatically. You will be given the calendars of our businessmen and a duration for the meeting. Your task is to ﬁnd the earliest time, when every businessman is free for at least that duration.

## Requirements
- All times in the calendars will be given in 24h format "hh:mm", the result must also be in that format
- A meeting is represented by its start time (inclusively) and end time (exclusively) -> if a meeting takes place from 09:00 - 11:00, the next possible start time would be 11:00
- The businessmen work from 09:00 (inclusively) - 19:00 (exclusively), the appointment must start and end within that range
- If the meeting does not ﬁt into the schedules, return `null`
- The duration of the meeting will be provided as an integer in minutes

*Following these rules and looking at the example below the earliest time for a 60 minutes meeting would be 12:15.*

## Example Schedule

| Person | Meetings                                                   |
|--------|------------------------------------------------------------|
| A      | 09:00 - 11:30, 13:30 - 16:00, 16:00 - 17:30, 17:45 - 19:00 |
| B      | 09:15 - 12:00, 14:00 - 16:30, 17:00 - 17:30                |
| C      | 11:30 - 12:15, 15:00 - 16:30, 17:45 - 19:00                |


## Data Format

The schedule will be provided as 3-dimensional array. The schedule above would be encoded this way:

```javascript
let schedules = [
  [['09:00', '11:30'], ['13:30', '16:00'], ['16:00', '17:30'], ['17:45', '19:00']],
  [['09:15', '12:00'], ['14:00', '16:30'], ['17:00', '17:30']],
  [['11:30', '12:15'], ['15:00', '16:30'], ['17:45', '19:00']]
];
```
