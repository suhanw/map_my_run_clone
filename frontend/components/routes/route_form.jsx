import React from 'react';
import {Link} from 'react-router-dom';
import Map from './map';
import Modal from '../modals/modal';
import FormErrorModal from '../modals/form_error_modal';

class RouteForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.props.route;
    this.state['panelCollapsed'] = false;
    this.state['panelClass'] = "route-form-details";
    this.state['mapSearchLocation'] = null;
    this.state['clearRoute'] = false;

    this.autocomplete = null;

    this.handleChange = this.handleChange.bind(this);
    this.saveRoute = this.saveRoute.bind(this);
    this.setRouteState = this.setRouteState.bind(this);
    this.renderCursorTooltip = this.renderCursorTooltip.bind(this);
    this.togglePanel = this.togglePanel.bind(this);
    this.renderToggler = this.renderToggler.bind(this);
    this.renderSearchBar = this.renderSearchBar.bind(this);
    this.addAutocomplete = this.addAutocomplete.bind(this);
    this.onPlaceChanged = this.onPlaceChanged.bind(this);
    this.resetMapSearchLocation = this.resetMapSearchLocation.bind(this);
    this.renderErrorMessage = this.renderErrorMessage.bind(this);
    this.clearRoute = this.clearRoute.bind(this);
    this.resetClearRoute = this.resetClearRoute.bind(this);
  }


  componentDidMount() {
    if (this.props.formType === 'edit') {
      const that = this;
      this.props.fetchRoute(this.props.match.params.routeId).then(
        () => this.setState(that.props.route),
        () => this.props.openModal('errors')
      );
    }

    // to style the directions
    document.getElementById("directions").addEventListener('DOMSubtreeModified', ()=>{
      // const warnbox = document.querySelector(".warnbox-content");

      // if (Boolean(warnbox) && !warnbox.innerHTML.includes('Tom Cruise')) {
      //   warnbox.innerHTML += ' <b>Unless of course you are Tom Cruise running to save the world.</b>';
      //   const tcGif = document.createElement('img');
      //   tcGif.setAttribute('src', 'https://media.giphy.com/media/5nPodXMLXXd1m/giphy.gif');
      //   tcGif.style = "width: 200px; margin: 5px auto;";
      //   warnbox.appendChild(tcGif);
      // }

      const warnbox = document.querySelector(".adp-warnbox");
      if (Boolean(warnbox)) warnbox.style = "display:none";

      const directionsText = document.querySelector(".adp");
      if (Boolean(directionsText)) {
        directionsText.style = 'font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif';
        directionsText.style = 'font-size: 12px';
      }

      const directionMarkers = document.querySelectorAll('.adp-marker');
      if (directionMarkers) {
        directionMarkers.forEach((marker) => marker.style="height: 20px; width: auto; margin-right: 5px");
      }

      return;
    });

    this.renderCursorTooltip();
    this.addAutocomplete();
  }

  render(){
    let routeFormTitle = "CREATE A ROUTE";
    if (this.props.formType === 'edit') routeFormTitle = 'EDIT ROUTE';

    let errorMessage = this.renderErrorMessage();

    return (
      <section id="route-form-container">

        <div id="cursor-tooltip"></div>

        <Modal modal={this.props.modal}
          errors = {this.props.errors}
          component={FormErrorModal}
          closeModal={this.props.closeModal} />


        <section className={this.state.panelClass}>
          <h2 className="route-form-title">{routeFormTitle}</h2>
          <form>
            {this.renderSearchBar()}
          </form>

          <form className="route-form-input-box">
            {this.renderToggler()}
            {errorMessage ? errorMessage : this.renderFormInput()}
          </form>
          <div id="directions"></div>
        </section>


        <Map className="map"
          setRouteState={this.setRouteState}
          openModal={this.props.openModal}
          receiveRouteErrors={this.props.receiveRouteErrors}
          formType={this.props.formType}
          route={this.props.route}
          clearRoute={this.state.clearRoute}
          resetClearRoute={this.resetClearRoute}
          mapSearchLocation={this.state.mapSearchLocation}
          resetMapSearchLocation={this.resetMapSearchLocation} />

      </section>
    );
  }

  renderErrorMessage() {
    if (this.props.formType === 'edit' && this.props.route.user !== this.props.currentUser.id) {
      return (
        <span className="message">
          You are not authorized to edit this route!
        </span>
      );
    } else {
      return null;
    }
  }

  renderSearchBar() {
    return (
      <section className="route-form-map-search">
        <h3>Choose Map Location</h3>
        <input id="autocomplete" type="search" placeholder="Enter city or address" />
        <button type="submit"
          onClick={(e)=>e.preventDefault()}>SEARCH</button>
      </section>
    );
  }

  addAutocomplete() {
    const searchInputField = document.getElementById('autocomplete');
    this.autocomplete = new google.maps.places.Autocomplete(searchInputField);
    this.autocomplete.addListener('place_changed', this.onPlaceChanged);
  }

  onPlaceChanged() {
    let place = this.autocomplete.getPlace();
    if (place.geometry) { // if user selects from dropdown
      this.setState({mapSearchLocation: place.geometry.location});
    } else { // else, clear search field and prompt user to select from dropdown
      const searchInputField = document.getElementById('autocomplete');
      searchInputField.placeholder="Select from the dropdown list";
      searchInputField.value = "";
    }
  }

  resetMapSearchLocation() {
    this.setState({mapSearchLocation: null});
  }

  renderCursorTooltip() {
    let cursorToolTip = document.getElementById('cursor-tooltip');
    window.onmousemove = (e) => {
      let x = e.clientX;
      let y = e.clientY;

      cursorToolTip.style.top = `${y+10}px`;
      cursorToolTip.style.left = `${x+10}px`;

      if (this.state.polyline === '') {
        cursorToolTip.innerHTML = "Click on 2 points (start and end) to map a route.";
      } else {
        cursorToolTip.innerHTML = "Click along any point on the route and drag to modify the route.";
      }
    };
  }

  renderFormInput() {

    let showRouteLink = null;
    if (this.props.formType === 'edit') {
      showRouteLink = <Link to={`/routes/${this.props.route.id}`}>Cancel</Link>;
    }

    return (
      <section className="route-form-input">
        <h3>Route Details</h3>
        <input type="text" placeholder="Name this route"
          onChange={this.handleChange}
          value={this.state.name} />
        <button type="submit" onClick={this.saveRoute}>
          SAVE ROUTE
        </button>
        <button type="button" onClick={this.clearRoute}>CLEAR ROUTE</button>
        {showRouteLink}
      </section>
    );
  }

  handleChange(e) {
    this.setState({name: e.target.value});
  }

  saveRoute(e) {
    e.preventDefault();
    const {name, polyline, distance, city, id} = this.state;
    const newRoute = {
      id,
      name,
      polyline,
      distance,
      city,
    };
    this.props.action(newRoute).then(
      ({payload})=> {
        this.props.history.push(`/routes/${Object.keys(payload.routes_by_id)[0]}`);
      },
      () => {
        this.props.openModal('errors');
      }
    );
  }

  setRouteState(newState) {
    this.setState({
      polyline: newState.polyline,
      distance: newState.distance,
      city: newState.city,
    });
  }


  renderToggler() {
    let toggleIcon = (this.state.panelCollapsed ?
    <i className="fa fa-caret-up" aria-hidden="true"></i> :
    <i className="fa fa-caret-down" aria-hidden="true"></i> );

    return (
      <div className="panel-toggler"
        onClick={this.togglePanel}>
        {toggleIcon}
      </div>
    );
  }

  togglePanel() {
    if (this.state.panelCollapsed) {
      this.setState({
        panelCollapsed: false,
        panelClass: "route-form-details",
      });
    } else {
      this.setState({
        panelCollapsed: true,
        panelClass: "route-form-details collapse",
      });
    }
  }

  clearRoute() {
    this.setState({clearRoute: true});
  }

  resetClearRoute() {
    this.setState({clearRoute: false});
  }
}

export default RouteForm;
