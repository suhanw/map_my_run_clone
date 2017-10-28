import React from 'react';
import Map from './map';
import Modal from '../modals/modal';
import FormErrorModal from '../modals/form_error_modal';

class RouteForm extends React.Component {
  constructor(props) {
    super(props);
    // debugger

    this.state = {
      name: '',
      polyline: '',
      distance: '',
      city: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.saveRoute = this.saveRoute.bind(this);
    this.setRouteState = this.setRouteState.bind(this);
  }

  componentDidMount() {
    document.getElementById("directions").addEventListener('DOMSubtreeModified', ()=>{
      const warnbox = document.querySelector(".warnbox-content");

      if (!warnbox.innerHTML.includes('Tom Cruise') && Boolean(warnbox.innerHTML.length)) {
        warnbox.innerHTML += ' <b>Unless of course you are Tom Cruise running to save the world.</b>';
        const tcGif = document.createElement('img');
        tcGif.setAttribute('src', 'https://media.giphy.com/media/5nPodXMLXXd1m/giphy.gif');
        warnbox.appendChild(tcGif);
      }

      return;
    });
  }

  render(){

    return (
      <section id="route-form-container">

        <Modal modal={this.props.modal}
          component={FormErrorModal}
          closeModal={this.props.closeModal} />

        <form className="route-form-details">
          {this.renderSearchBar()}
          {this.renderFormInput()}
          <div id="directions"></div>
        </form>
        <Map className="map"
          width="100%"
          height="100vh"
          setRouteState={this.setRouteState}
          openModal={this.props.openModal}/>
      </section>
    );
  }

  renderSearchBar() {
    return (
      <section className="route-form-map-search">
        <h3>Choose map location</h3>
        <input type="search" placeholder="Enter location" />
        <button onClick={this.handleSearch}>
          SEARCH
        </button>
      </section>
    );
  }

  renderFormInput() {
    return (
      <section className="route-form-input">
        <h3>Route Details</h3>
        <input type="text" placeholder="Name this map"
          onChange={this.handleChange} />
        <button onClick={this.saveRoute}>
          SAVE ROUTE
        </button>
      </section>
    );
  }

  handleChange(e) {
    this.setState({name: e.target.value});
  }

  handleSearch(e) {
    e.preventDefault();
  }

  saveRoute(e) {
    e.preventDefault();
    this.props.createRoute(this.state).then(
      ({route})=> {
        this.props.history.push(`/routes/${route.id}`);
      },
      ({errors}) => {
        this.props.openModal({errors});
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
}

export default RouteForm;
