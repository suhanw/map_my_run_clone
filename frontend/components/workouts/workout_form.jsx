import React from 'react';
import {randomizer} from '../../util/randomizer';

class WorkoutForm extends React.Component {
  constructor(props) {
    super(props);

    const {name, duration, route} = this.props.workout;

    let h;
    let m;
    let s;

    if (duration) {
      h = this.renderHours(duration);
      m = this.renderMinutes(duration);
      s = this.renderSeconds(duration);
    }

    const date = new Date().toISOString().substr(0, 10);


    this.state = {
      name,
      date,
      route,
      h, //duration
      m, //duration
      s, //duration
      loadingRoutes: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.renderRouteOptions = this.renderRouteOptions.bind(this);
  }

  componentDidMount(){
    this.props.fetchRoutes().then(
      ()=>{
        this.setState({
          loadingRoutes: false
        });
      }
    );
  }



  render() {

    const adGifClass = `ad-gif-${randomizer(3, 1)}`;


    return (
      <section className="workout-form-container">
        <form className="workout-form">
          <h2>LOG A WORKOUT</h2>
          <p>
            If you've been active, get credit for it! Add your workout
            details below, and stay on top of your fitness goals.
          </p>

          <section className="workout-form-box">
            <label className="workout-form-name">
              Workout name
              <input type="text"
                value={this.state.name}
                placeholder="Name your workout"
                onChange={this.handleChange('name')} />
            </label>
            <label className="workout-form-date">
              Date
              <input type="date"
                value={this.state.date}
                onChange={this.handleChange('date')} />
            </label>

            <label className="workout-form-route-option">
              Route
              <select onChange={this.handleChange('route')} value={this.state.route ? this.state.route : ""}>
                {this.renderRouteOptions()}
              </select>
            </label>


            <label className="workout-form-duration">
              <span>Duration</span>
              <input type="text" placeholder="hh"
                value={this.state.h}
                onChange={this.handleChange('h')} /> : <input type="text" placeholder="mm"
                value={this.state.m}
                onChange={this.handleChange('m')} /> : <input type="text" placeholder="ss"
                value={this.state.s}
                onChange={this.handleChange('s')} />
            </label>

            <label className="workout-form-button">
              <button className="blue-button"
                onClick={this.handleClick}>
                SAVE
              </button>
            </label>

          </section>

        </form>

        <aside className="workout-form-sidebar">
          <div className={adGifClass}>
            <small>Ad</small>
            <small>Rent this movie somewhere near you.</small>
          </div>
        </aside>

      </section>
    );
  }

  handleChange(key) {
    const that = this;
    return (e) => {
      that.setState({[key]: e.target.value});
    };
  }

  handleClick(e) {
    e.preventDefault();

    let duration = this.state.h * 3600;
    duration += this.state.m * 60;
    duration += this.state.s * 1;



    const workout = {
      name: this.state.name,
      date: this.state.date,
      duration: duration,
      route_id: this.state.route,
    };


    this.props.action(workout).then(
      (action)=>{
        const workoutId = Object.keys(action.payload.workouts_by_id)[0];
        debugger
        this.props.history.push(`/workouts/${workoutId}`);
      }
    );

  }

  renderRouteOptions() {

    if (this.state.loadingRoutes) {
      return (
        <option selected disabled="disabled" value="">
          Loading available routes..
        </option>
      );
    } else {
      let routeOptions = [];
      routeOptions.push(
        <option key="default" selected disabled="disabled" value="">Select your route</option>
      );
      this.props.routes.ordered_ids.forEach((routeId)=>{
        const route = this.props.routes.routes_by_id[routeId];
        routeOptions.push(
          <option key={route.id} value={route.id}>{
              `${route.name} - ${route.distance}mi in ${route.city}`
          }</option>
        );
      });
      return routeOptions;
    }
  }

  renderHours(duration) {
    return Math.floor(duration / 3600);
  }

  renderMinutes(duration) {
    return Math.floor(duration % 3600 / 60);
  }

  renderSeconds(duration) {
    return Math.floor(duration % 3600 % 60);
  }
}

export default WorkoutForm;
