import moment from 'moment-timezone';


export const formatTimestamp = (timestamp: Date, userTimeZone: string) => {
    const now = moment();
    const yesterday = moment().subtract(1, 'days');
    const inputTime = moment(timestamp).tz(userTimeZone);
    
    const is24HourFormat = userTimeZone === 'Europe/Paris' // Add other timezones that use 24 hour format

    if (inputTime.isSame(yesterday, 'day')) {
      // If the timestamp is from 'yesterday', show it as 'MMM D'
      return inputTime.format('MMM D');
    } else if (inputTime.isSame(now, 'day')) {
      // If time is within today, show it in 'h:mm A' format if in a AM/PM timezone, else 'HH:mm'
      return inputTime.format(is24HourFormat ? 'HH:mm' : 'h:mm A');
    } else {
      // If time is older than yesterday, show it in 'MMM D' format
      return inputTime.format('MMM D');
    }
};