import { csrfFetch } from "./csrf";

/****************************** CONSTS ***********************************/
const GET_SPOT_BOOKINGS = 'bookings/GET_SPOT_BOOKINGS'
const GET_USER_BOOKINGS = 'bookings/GET_USER_BOOKINGS'
const POST_SPOT_BOOKING = 'bookings/POST_SPOT_BOOKING'
const UPDATE_SPOT_BOOKING = 'bookings/UPDATE_SPOT_BOOKING'
const DELETE_SPOT_BOOKING = 'bookings/DELETE_SPOT_BOOKING'


/***************************** ACTION CREATORS ******************************/
const getAllSpotBookings = bookings => {
    return {
        type: GET_SPOT_BOOKINGS,
        payload: bookings
    }
}

const getUserBookings = bookings => {
    return {
        type: GET_USER_BOOKINGS,
        payload: bookings
    }
}

const postSpotBooking = booking => {
    return {
        type: POST_SPOT_BOOKING,
        payload: booking
    }
}

const updateSpotBooking = booking => {
    return {
        type: UPDATE_SPOT_BOOKING,
        payload: booking
    }
}

const deleteSpotBooking = (bookingId) => {
    return {
        type: DELETE_SPOT_BOOKING,
        payload: bookingId
    }
}


/***************************** THUNKS ***************************************/
export const getAllSpotBookingsThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`)
    const data = await response.json();
    dispatch(getAllSpotBookings(data.Bookings));
    return data;
}

export const getAllUserBookingsThunk = () => async (dispatch) => {
    // /api/bookings/:spotId, POST
    const response = await csrfFetch(`/api/bookings/current`)
    const data = await response.json();
    dispatch(getUserBookings(data.Bookings));
    return data;
}

export const postSpotBookingThunk = (spotId, booking) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(booking)
    })

    const postedBooking = await response.json();
    dispatch(postSpotBooking(postedBooking));
    return postedBooking;
}

export const updateSpotBookingThunk = (booking) => async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/${booking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking)
    })

    const updatedBooking = await response.json();
    dispatch(updateSpotBooking(updatedBooking));
    return updatedBooking;
}

export const deleteSpotBookingThunk = (bookingId) => async(dispatch) => {
    const response = await csrfFetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
    })

    const confirmation = await response.json();
    dispatch(deleteSpotBooking(bookingId));
    return confirmation;
}


/******************************** REDUCER ***************************/
const initialState = { spotBookings: {}, userBookings: { pastBookings: {}, futureBookings: {} } }

export default function bookingsReducer(state=initialState, action) {
    Object.freeze(state);
    const newState = { ...state }

    switch(action.type) {
        case GET_SPOT_BOOKINGS: {
            newState.spotBookings = {}
            for (const booking of action.payload) {
                newState.spotBookings[booking.id] = booking
            }
            return newState;
        }
        case GET_USER_BOOKINGS: {
            // normalize user bookings
            const normalizedPastBookings = {};
            const normalizedFutureBookings = {};

            for (const booking of action.payload) {
                const startDate = new Date(booking.startDate)
                if (startDate > new Date()) {
                    // if startDate is after today then add normalized data to future booking
                    normalizedFutureBookings[booking.id] = booking;
                } else {
                    // else add normalized data to past bookings
                    normalizedPastBookings[booking.id] = booking;
                }
            }

            newState.userBookings = { pastBookings: normalizedPastBookings, futureBookings: normalizedFutureBookings };
            return newState;
        }
        case POST_SPOT_BOOKING: {
            newState.spotBookings = { ...state.spotBookings };
            newState.spotBookings[action.payload.id] = action.payload;

            newState.userBookings = { ...state.userBookings };
            newState.userBookings.futureBookings = { ...state.userBookings.futureBookings }
            newState.userBookings.futureBookings[action.payload.id] = action.payload;

            return newState;
        }
        case UPDATE_SPOT_BOOKING: {
            newState.spotBookings = { ...state.spotBookings };
            if (action.payload.id in newState.spotBookings) {
                newState.spotBookings[action.payload.id] = action.payload
            }

            newState.userBookings = { ...state.userBookings };
            newState.userBookings.futureBookings = { ...state.userBookings.futureBookings };
            newState.userBookings.futureBookings[action.payload.id] = { ...state.userBookings.futureBookings[action.payload.id]};
            newState.userBookings.futureBookings[action.payload.id].startDate = action.payload.startDate;
            newState.userBookings.futureBookings[action.payload.id].endDate = action.payload.endDate;

            return newState;
        }
        case DELETE_SPOT_BOOKING: {
            newState.spotBookings = { ...state.spotBookings }
            // check to see if the spotBooking have the bookingId?
            if (action.payload in newState.spotBookings) {
                delete newState.spotBookings[action.payload]
            }

            newState.userBookings = { ...state.userBookings }
            newState.userBookings.futureBookings = { ...state.userBookings.futureBookings }
            delete newState.userBookings.futureBookings[action.payload]
            return newState;
        }
        default:
            return state;
    }
}
