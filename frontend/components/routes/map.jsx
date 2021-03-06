import React from 'react';
import {fetchCity} from '../../util/routes_api_util';
import Spinner from '../spinner';

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };

    this.startPos = null;
    this.endPos = null;
    this.map = null;
    this.routePath = null;

    this.renderInitMap = this.renderInitMap.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.placeMarker = this.placeMarker.bind(this);
    this.generatePath = this.generatePath.bind(this);
    this.renderPath = this.renderPath.bind(this);
    this.renderExistingRoute = this.renderExistingRoute.bind(this);
    this.initDirectionsRenderer = this.initDirectionsRenderer.bind(this);
    this.updateRoutePolyline = this.updateRoutePolyline.bind(this);
  }

  render() {
    if (this.state.loading) {
      return(
        <div className="spinner-box">
          <Spinner />;
        </div>
      );
    }

    return (
        <div id='map'></div>
    );
  }

  componentDidMount(){
    this.center = {
      lat: 34.030059,
      lng: -118.429283,
    };

    // get curr location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (currPos)=>{ //success callback
          this.center.lat = currPos.coords.latitude;
          this.center.lng = currPos.coords.longitude;
          this.setState({loading: false});
          this.renderInitMap(this.center);
        },
        (err) => { //error callback, when user disable location setting
          this.setState({loading: false});
          this.renderInitMap(this.center);
        }
      );
    }
  }

  componentWillReceiveProps(newProps){
    if (newProps.route) {
      this.routePath = google.maps.geometry.encoding.decodePath(newProps.route.polyline);
    }

    if (newProps.mapSearchLocation) {
      this.map.panTo(newProps.mapSearchLocation);
      this.map.setZoom(15);
      this.props.resetMapSearchLocation();
    }

    if (newProps.clearRoute) {
      this.directionsRenderer.setMap(null);
      document.getElementById('directions').innerHTML = '';
      this.props.setRouteState({
        polyline: '',
        distance: null,
        city: null,
      });
      this.initDirectionsRenderer();
      this.props.resetClearRoute();
    }
  }

  renderInitMap(center){
    const mapOptions = {
      center: center,
      zoom: 15,
      draggableCursor: "crosshair"
    };
    const mapDom = document.getElementById('map');
    this.map = new google.maps.Map(
      mapDom,
      mapOptions
    );

    // to allow user to add markers
    this.map.addListener('click', this.handleMapClick);

    // create and hook DirectionsRenderer to map
    this.initDirectionsRenderer();

    // to render existing route for edit form
    if (this.props.formType === 'edit') {
      this.renderExistingRoute();
    }
  }

  initDirectionsRenderer() {
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      draggable: true,
      map: this.map,
      panel: document.getElementById('directions'), // to display directions
      preserveViewport: true, // to prevent the map from zooming into path
    });

    // to update polyline as user creates a new route, or drags the route
    this.directionsRenderer.addListener('directions_changed', this.updateRoutePolyline);
  }

  updateRoutePolyline() {
    // to update polyline as user creates a new route, or drags the route
    const directionsResult = this.directionsRenderer.getDirections();
    const directionsRoute = directionsResult.routes[0];
    const newPolyline = directionsRoute.overview_polyline;
    const newDistance = directionsRoute.legs[0].distance.text;
    const originLat = directionsResult.request.origin.location.lat();
    const originLng = directionsResult.request.origin.location.lng();
    const latLng = `${originLat},${originLng}`;

    fetchCity(latLng).then(
      (res) => {
        if (res.status === 'OK') {
          let newCity = res.results[0].formatted_address;
          // send state back to RouteForm
          this.props.setRouteState({
            polyline: newPolyline,
            distance: newDistance,
            city: newCity,
          });
        } else {
          this.props.receiveRouteErrors([res.error_message]);
          this.props.openModal('errors');
        }
      }
    );
  }

  renderExistingRoute() {
    this.routePath = google.maps.geometry.encoding.decodePath(this.props.route.polyline);
    // pass in the intermediate points between origin and destination
    // as waypoints. Google only allows 23 free waypoints, including origin and dest.
    const lastIdx = this.routePath.length < 23 ? this.routePath.length-1 : 22;
    const waypoints = this.routePath.slice(1, lastIdx).map((point)=>{
      return {
        location: point,
        stopover: false,
      };
    });

    let request = {
      origin: this.routePath[0],
      destination: this.routePath[this.routePath.length-1],
      waypoints: waypoints,
      travelMode: 'WALKING',
    };

    this.generatePath(request);

    // Credit to find center of polyline:
    // https://stackoverflow.com/questions/3320925/google-maps-api-calculate-center-zoom-of-polyline
    const bounds = new google.maps.LatLngBounds();
    this.routePath.forEach((coord)=>{
      bounds.extend(coord);
    });
    this.map.fitBounds(bounds);
  }

  handleMapClick(event) {
    this.placeMarker(event.latLng);
  }

  placeMarker(latLng) {
    let marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
    });

    if (!this.startPos) { // record start position
      this.startPos = marker;
    } else if (!this.endPos) { // record end position and generate path
      this.endPos = marker;
      let request = {
        origin: this.startPos.getPosition(),
        destination: this.endPos.getPosition(),
        travelMode: 'WALKING',
      };
      this.generatePath(request);
      // reset the markers
      this.startPos.setMap(null);
      this.endPos.setMap(null);
      this.startPos = null;
      this.endPos = null;
    }
  }

  generatePath(request) {
    let directionsService = new google.maps.DirectionsService();
    // initiate request for directions betw 2 points
    directionsService.route(
      request,
      this.renderPath //if successful, render path
    );
  }

  renderPath(result, status) {
    if (status === 'OK') {
      this.directionsRenderer.setDirections(result);
    } else {
      this.props.receiveRouteErrors(['Dude, that route is impossible, mission-wise.']);
      this.props.openModal('errors');
    }
  }
}

export default Map;
