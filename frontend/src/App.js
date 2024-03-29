import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import * as sessionActions from './store/session';
import Navigation from './components/Navigation';
import SpotTiles from './components/SpotTile';
import SpotDetails from './components/SpotDetails';
import AddSpotForm from './components/SpotForm/AddSpotForm';
import UserSpots from './components/UserSpots';
import UserReviews from './components/UserReviews';
import UserReservations from './components/UserReservations';
import UpdateUserSpotForm from './components/SpotForm/UpdateSpotForm';

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser())
      .then(() => setIsLoaded(true))
  }, [dispatch])

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <SpotTiles />
          </Route>
          <Route path="/myspots/:spotId/edit">
            <UpdateUserSpotForm />
          </Route>
          <Route path="/myspots">
            <UserSpots />
          </Route>
          <Route path="/myreviews">
            <UserReviews />
          </Route>
          <Route path="/spots/add">
            <AddSpotForm />
          </Route>
          <Route path="/spots/:spotId">
            <SpotDetails />
          </Route>
          <Route path={"/mytrips"}>
            <UserReservations />
          </Route>
          <Route>
            <h2>Page not found</h2>
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
