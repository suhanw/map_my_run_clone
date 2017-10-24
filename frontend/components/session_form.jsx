import React from 'react';
import {Link} from 'react-router-dom';

class SessionForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      fname: '',
      lname: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    // debugger
  }

  render() {

    // to render any errors
    let errors;
    if(this.props.errors.length > 0) {
      errors = this.renderErrors(this.props.errors);
    }

    // to render the login or signup link above form
    let shortcutLink = 'SIGN UP';
    let shortcutLinkUrl = '/signup';

    // to render fields specific to new user form
    let signupFields;
    if (this.props.formType === 'signup') {
      shortcutLink = 'LOG IN';
      shortcutLinkUrl = '/login';
      signupFields = (
        <section>
          <input type="text" placeholder="First name"
            onChange={this.handleChange('fname')}
            value={this.state.fname} />
          <input type="text" placeholder="Last name"
            onChange={this.handleChange('lname')}
            value={this.state.lname} />
        </section>
      );
    }



    return (
      <section className="session-form-background">
        <form className="session-form">

          <Link to={shortcutLinkUrl} className="session-form-shortcut">
            {shortcutLink}
          </Link>

          <button className="session-demo-button">
            <i class="fa fa-user-circle" aria-hidden="true"></i>
            LOG IN WITH DEMO
          </button>

          <p>OR</p>

          {errors}

          {signupFields}

          <input type="text" placeholder="Email"
            onChange={this.handleChange('email')}
            value={this.state.email} />

          <input type="password" placeholder="Password"
            onChange={this.handleChange('password')}
            value={this.state.password} />

          <button className="session-submit-button"
            onClick={this.handleClick}>
            {this.props.formType === 'login' ? 'LOG IN' : 'SIGN UP'}
          </button>

        </form>

      </section>
    );
  }

  renderErrors(errors) {
    const errorItems = this.props.errors.map((error, i)=>{
      return (
        <li key={i}>{error}</li>
      );
    });
    return (
      <ul className="errors">
        {errorItems}
      </ul>
    );
  }

  handleChange(key) {
    // debugger
    return (event) => {
      this.setState({[key]: event.target.value});
    };
  }

  handleClick(event) {
    this.props.submitForm(this.state);
  }
}

export default SessionForm;