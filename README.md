# Assessment 1 - retryFailures

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
