import { TDays, TSchedule } from './offeredCourse.interface';

export const hasTimeConflict = (
  assignedSchedules: TSchedule[],
  newSchedule: TSchedule,
) => {
  // need to use for loop as return will not work perfectly in forEach
  for (const schedule of assignedSchedules) {
    const alreadyBookedStartTime = new Date(`1970-01-01T${schedule.startTime}`);
    const alreadyBookedEndTime = new Date(`1970-01-01T${schedule.endTime}`);

    const newWantedStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
    const newWantedEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);

    if (
      newWantedStartTime < alreadyBookedEndTime &&
      newWantedEndTime > alreadyBookedStartTime
    ) {
      return true;
    }
  }
  
  return false;
};
