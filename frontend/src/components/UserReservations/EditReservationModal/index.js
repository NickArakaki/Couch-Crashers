import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useModal } from "../../../context/Modal";
import ReservationForm from "../../SpotDetails/ReservationForm"
import * as spotActions from "../../../store/spots"
import * as bookingActions from "../../../store/bookings"
import "./EditReservationModal.css"

function EditReservationModal({ reservation }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [isLoaded, setIsLoaded] = useState(false);
    const spotDetails = useSelector(state => state.spots.singleSpot)

    useEffect(() => {
        dispatch(spotActions.getSingleSpotThunk(reservation.spotId))
        // get the spot bookings here?
            .then(() => dispatch(bookingActions.getAllSpotBookingsThunk(reservation.spotId)))
            .then(() => setIsLoaded(true))
            .catch(async (error) => {
                console.log(error)
            })
    }, [])

    if (!isLoaded) return <div>Loading...</div>

    return (
        <div className="edit-reservation-form">
            <h1>Edit Reservation</h1>

            <ReservationForm spot={spotDetails} reservation={reservation} />

            <button onClick={closeModal} >Cancel</button>
        </div>
    )
}

export default EditReservationModal;
