export default function SpotTile({ spot }) {
    return (
        <>
            <img className="spot_tile_img" src={spot.previewImage} alt={`${spot.name} preview image`}/>
            <div className="spot_tile_details_div">
                <div className="spot_tile_location_and_price_div">
                    <div className="spot_tile_location_div">
                        <div className="spot_tile_spot_name spot_tile_info">{spot.name}</div>
                    </div>
                    <br />
                    <div className="spot_tile_price spot_tile_info">${spot.price} night</div>
                </div>
                <div className="spot_tile_avg_stars spot_tile_info"><i className="fa-solid fa-star" /> {spot.avgRating ? Number(spot.avgRating).toFixed(1) : "New"}</div>
            </div>
        </>
    )
}
