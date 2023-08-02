async function retryFailures<T>(
  fn: () => Promise<T>,
  retries: number
): Promise<T> {
  // your code here
  let i = 0;
  let latestError: unknown;
  while (i < retries) {
    i++;
    try {
      return await fn();
    } catch (error: unknown) {
      latestError = error;
    }
  }
  throw latestError;
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

// succeeds on attempt number 3
retryFailures(createTargetFunction(3), 5).then((attempt) => {
  console.log(attempt === 3, "createTargetFunction(3), 5");
  console.assert(attempt === 3, "createTargetFunction(3), 5");
});

// fails on attempt number 2 and throws last error
retryFailures(createTargetFunction(3), 2).then(
  () => {
    throw new Error("should not succeed");
  },
  (e) => {
    console.log(e.attempt === 2, "createTargetFunction(3), 2");
    console.assert(e.attempt === 2, "createTargetFunction(3), 2");
  }
);

// succeeds
retryFailures(createTargetFunction(10), 10).then((attempt) => {
  console.log(attempt === 10, "createTargetFunction(10), 10");
  console.assert(attempt === 10, "createTargetFunction(10), 10");
});
