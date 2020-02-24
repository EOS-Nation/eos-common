class Time {
  public sec_since_epoch(): number {
    return Date.now();
  }
}

export function current_time_point(): Time {
  return new Time();
}

export const block_timestamp_epoch = new Date(Date.UTC(2000, 0, 1, 0, 0, 0, 0)).getTime();
export const seconds_per_day = 60 * 60 * 24;
