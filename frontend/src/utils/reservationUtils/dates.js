// takes in a list objects
// each object contains a startDate and an endDate string 'yyyy-mm-dd'

import moment from "moment";

// returns a list of date objects within each date range for dates on/after today
export const getListOfBookedDates = (dateRanges) => {
    const bookedDates = []
    const today = new Date(formatDateYYYYMMDD(new Date()));

    // iterate over list of dateRanges
    dateRanges.forEach(dateRange => {
        if (new Date(dateRange.endDate) >= today) { // if end date is today or in the future
            const dateList = getListOfDates(dateRange.startDate, dateRange.endDate)
            bookedDates.push(...dateList)
        }
    })
    // return list of booked dates
    return bookedDates;
}

// takes in a start date and end date strings "yyyy-mm-dd"
// returns a list of date objects from start date to end date (inclusive)
// can assume endDate is after startDate
export const getListOfDates = (start, end) => {
    const dateList = []

    const startDate = new Date(start)
    const endDate = new Date(end)

    for (const date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        dateList.push(new Date(date))
    }

    return dateList;
}

// formatDateYYYYMMDD
export const formatDateYYYYMMDD = (date) => {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();

    return formatDate(year, month, day);
}


export const formatDate = (year, month, day) => {
    year = year.toString();
    if (month < 10) month = "0" + month.toString();
    if (day < 10) day = "0" + day.toString();

    return `${year}-${month}-${day}`
}


// Input: 2D array, each element is a [ [startDate, endDate], ...]
// Output: boolean indicating if inputDate is in one of the ranges
export const isValidDay = (inputDate, bookedDateRanges) => {
    let isNotValid = false

    for (const bookedDateRange of bookedDateRanges) {
        if (inputDate.isBetween(bookedDateRange[0], bookedDateRange[1])) {
            isNotValid=true;
            break
        }
    }

    return isNotValid;
}

// Sort bookings by startDate
export const sortBookingsByStart = (bookingsList) => {
    return bookingsList.sort((a, b) => {
        return Date.parse(new Date(a[0])) - Date.parse(new Date(b[0]))
    })
}

// find first available start date
// must be at least 2 continuous days
// cannot be before today
export const findFirstValidDate = (sortedBookingList) => {
    let startDate = moment();

    // iterate over sortedBookingList
    for (const booking of sortedBookingList) {
        const start = moment(booking[0]);
        const end = moment(booking[1]);

        if (end.isAfter(startDate) && start.isAfter(startDate)) {
            // calculate the difference between startDate and start
            const difference = start.diff(startDate, "days")
            if (difference >= 2) {
                // if difference is two days return the startDate
                return startDate;
            } else {
                // else change the startDate to the day after end
                startDate = end.add(1, "days");
            }
        }
    }

    return startDate;
}

// find the maxDate given a start date and list of ordered bookings
// iterate over sorted list of bookings
// find the first booking that comes after current start date
// if there are no bookings after start date idk man
// startDate = "YYYY-MM-DD"
// sortedBookingsList = [["YYYY-MM-DD", "YYYY-MM-DD"], ...]
export const findMaxEndDate = (startDate, sortedBookingsList) => {
    const start = moment(startDate);
    // iterate over list of sorted bookings and find when the next booking starts
    for(const booking of sortedBookingsList) {
        const bookedStart = moment(booking[0])
        if (bookedStart.isAfter(start)) { // we found the next start date
            // the max date is the day before the next booking starts
            return bookedStart;
        }
    }
    // if there are no bookings that start after the new Start return null
    return null;
}

export const findMinStartDate = (endDate, sortedBookingsList) => {
    // return a moment obj where the date is the minimum start date before the previous listing
    // or the current date whichever comes later
    // find the end date of the previous booking
    const newEndDate = moment(endDate);
    const firstValidDate = findFirstValidDate(sortedBookingsList);

    let minStartDate;

    for(let i = sortedBookingsList.length; i >= 0; i--) {
        const booking = sortedBookingsList[i]
        // this logic is flawed, need to refactor to find based on date passed
        if (booking && moment(booking[1]).isBefore(newEndDate) && moment(booking[1]).isAfter(firstValidDate)) {
            minStartDate = moment(booking[1])
            return minStartDate;
        }
    }

    return firstValidDate;
}

export const checkIfOutOfRange = (day, startDate, endDate) => {
    const start = startDate || moment();
    if (day.isBefore(start) || day.isAfter(endDate)) return true;
    return false;
}
