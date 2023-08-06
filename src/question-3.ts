type Schedule = [string, string][];
type PersonSchedule = Schedule[];

function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const hourString = hours.toString().padStart(2, "0");
  const minuteString = remainingMinutes.toString().padStart(2, "0");
  return `${hourString}:${minuteString}`;
}

function getFreeSlots(schedules: Schedule): Schedule {
  const startWorkingTimeMins = timeToMinutes("09:00");
  const endWorkingTimeMins = timeToMinutes("19:00");
  let previousEnd = startWorkingTimeMins;
  const freeSlots: Schedule = [];
  for (const [start, end] of schedules) {
    const startMins = timeToMinutes(start);
    const endMins = timeToMinutes(end);

    if (startMins > previousEnd) {
      freeSlots.push([minutesToTime(previousEnd), start]);
    }

    previousEnd = endMins;
  }

  if (previousEnd < endWorkingTimeMins) {
    freeSlots.push([
      minutesToTime(previousEnd),
      minutesToTime(endWorkingTimeMins),
    ]);
  }

  return freeSlots;
}

// get free time from persons' schedules
function getIntersectedSlots(
  scheduleA: Schedule,
  scheduleB: Schedule
): Schedule {
  // find and collect the overlapped time slot(s) from the Free Slots.
  // Example:
  // S1 freeslot => 1000 - 1200
  // S2 freeslot => 1100 - 1330
  // Overlapped time in both FreeSlot is between 1100 - 1200
  let intersectedSlots: Schedule = [];
  if (scheduleA.length === 0 || scheduleB.length === 0) {
    return intersectedSlots;
  }

  for (const [startA, endA] of scheduleA) {
    for (const [startB, endB] of scheduleB) {
      const latestStartInMins = Math.max(
        timeToMinutes(startA),
        timeToMinutes(startB)
      );
      const earliestEndInMins = Math.min(
        timeToMinutes(endA),
        timeToMinutes(endB)
      );

      if (latestStartInMins < earliestEndInMins) {
        intersectedSlots.push([
          minutesToTime(latestStartInMins),
          minutesToTime(earliestEndInMins),
        ]);
      }
    }
  }

  return intersectedSlots;
}

function findEarliestMeetingTime(
  schedules: PersonSchedule,
  duration: number
): string | null {
  let result: string | null = null;

  if (schedules.length === 0 || schedules[0].length === 0) {
    return result;
  }

  // get the initial freeSlots from first person's schedules
  let freeSlots = getFreeSlots(schedules[0]);
  if (freeSlots.length === 0) {
    return result;
  }

  // scan through the rest of schedules starting from second set.
  for (const schedule of schedules.slice(1)) {
    const scheduleFreeSlots = getFreeSlots(schedule);
    freeSlots = getIntersectedSlots(freeSlots, scheduleFreeSlots);
    if (freeSlots.length === 0) {
      return result;
    }
  }

  for (const [start, end] of freeSlots) {
    const freeSlotDuration = timeToMinutes(end) - timeToMinutes(start);
    const isSuitableSlot = freeSlotDuration >= duration;
    if (isSuitableSlot) {
      result = start;
      return result;
    }
  }
  return result;
}

function getSchedules(): PersonSchedule {
  return [
    [
      ["09:00", "11:30"],
      ["13:30", "16:00"],
      ["16:00", "17:30"],
      ["17:45", "19:00"],
    ],
    [
      ["09:15", "12:00"],
      ["14:00", "16:30"],
      ["17:00", "17:30"],
    ],
    [
      ["11:30", "12:15"],
      ["15:00", "16:30"],
      ["17:45", "19:00"],
    ],
  ];
}

console.assert(findEarliestMeetingTime(getSchedules(), 60) === "12:15");
console.log(findEarliestMeetingTime(getSchedules(), 60));

console.assert(findEarliestMeetingTime(getSchedules(), 120) === null);
console.log(findEarliestMeetingTime(getSchedules(), 120));
