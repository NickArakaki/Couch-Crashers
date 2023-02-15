import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import * as spotActions from '../../store/spots';
import validateSpotForm from "../../utils/validation"

import "./UpdateUserSpotForm.css"

export default function UpdateUserSpotForm() {
    const history = useHistory();
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);

    const [country, setCountry] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState("");
    const [previewImage, setPreviewImage] = useState('');
    const [image1, setImage1] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [image4, setImage4] = useState('');
    const [spotImages, setSpotImages] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [serverErrors, setServerErrors] = useState([]);

    useEffect(() => {
        const imageList = [];
        if (image1) imageList.push(image1);
        if (image2) imageList.push(image2);
        if (image3) imageList.push(image3);
        if (image4) imageList.push(image4);

        setSpotImages(imageList);

    }, [image1, image2, image3, image4])

    if (!sessionUser) history.push('/');

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <form className="update_spot_form" onSubmit={handleSubmit}>
            <h2 className="update_spot_form_title">Update Your Spot</h2>
            {serverErrors.length > 0 && (
                <>
                    {serverErrors.map(error => (
                        <li key={error} className="error">{error}</li>
                    ))}
                </>
            )}
            <div className="update_spot_form_location_div form_block">
                <h3>Where's your place located?</h3>
                <p>Guests will only get your exact address once they have booked a reservation.</p>
                <div>
                    Country: {validationErrors.country && <span className="error">{validationErrors.country}</span>}
                    <input
                        type="text"
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                </div>
                <div>
                    Street Address: {validationErrors.address && <span className="error">{validationErrors.address}</span>}
                    <input
                        type="text"
                        placeholder="Address"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                    />
                </div>
                <div>
                    City: {validationErrors.city && <span className="error">{validationErrors.city}</span>}
                    <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />,
                </div>
                <div>
                    State: {validationErrors.state && <span className="error">{validationErrors.state}</span>}
                    <input
                        type="text"
                        placeholder="STATE"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    />
                </div>
                <div>
                    Latitude:
                    <input
                        type="text"
                        placeholder="Latitude"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                    />
                </div>
                <div>
                    Longitude
                    <input
                        type="text"
                        placeholder="Longitude"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                    />
                </div>
            </div>
            <div className="update_spot_form_description_div form_block">
                <h3>Describe your place to guests</h3>
                <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                <textarea
                    className="update_spot_form_description_textarea"
                    placeholder="Please write at least 30 characters"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                {validationErrors.description && <span className="error">{validationErrors.description}</span>}
            </div>
            <div className="update_spot_form_title_wrapper form_block">
                <h3>Create a tile for your spot</h3>
                <p>Catch guests' attention with a spot title that highlights what makes your place special</p>
                <input
                    type="text"
                    placeholder="Name of your spot"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            {validationErrors.title && <span className="error">{validationErrors.title}</span>}
            <div className="update_spot_form_price_wrapper form_block">
                <h3>Set a base price for your spot</h3>
                <p>Competitive pricing can help your listing stand out and rank higher ins search results</p>
                $ <input
                    type="number"
                    placeholder="Price per night (USD)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                {validationErrors.price && <span className="error">{validationErrors.price}</span>}
            </div>
            <div className="update_spot_form_photo_wrapper form_block">
                <h3>Liven up your spot with photos</h3>
                <p>Submit a link to at least one photo to publish your spot</p>
                <input
                    className="update_spot_form_preview_image"
                    type="text"
                    placeholder="Preview Image URL"
                    value={previewImage}
                    onChange={(e) => setPreviewImage(e.target.value)}
                />
                {validationErrors.previewImage && <span className="error">{validationErrors.previewImage}</span>}
                {validationErrors.previewImageType && <span className="error">{validationErrors.previewImageType}</span>}
                <input
                    className="update_spot_form_image"
                    type="text"
                    placeholder="Image URL"
                    value={image1}
                    onChange={(e) => setImage1(e.target.value)}
                />
                {validationErrors.spotImagesType0 && <span className="error">{validationErrors.spotImagesType0}</span>}
                <input
                    className="update_spot_form_image"
                    type="text"
                    placeholder="Image URL"
                    value={image2}
                    onChange={(e) => setImage2(e.target.value)}
                />
                {validationErrors.spotImagesType1 && <span className="error">{validationErrors.spotImagesType1}</span>}
                <input
                    className="update_spot_form_image"
                    type="text"
                    placeholder="Image URL"
                    value={image3}
                    onChange={(e) => setImage3(e.target.value)}
                />
                {validationErrors.spotImagesType2 && <span className="error">{validationErrors.spotImagesType2}</span>}
                <input
                    className="update_spot_form_image"
                    type="text"
                    placeholder="Image URL"
                    value={image4}
                    onChange={(e) => setImage4(e.target.value)}
                />
                {validationErrors.spotImagesType3 && <span className="error">{validationErrors.spotImagesType3}</span>}
            </div>
            <button className="update_spot_form_submit_button" type="submit">Update Spot</button>
        </form>
    )
}
