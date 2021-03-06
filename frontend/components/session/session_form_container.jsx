import {connect} from 'react-redux';
import SessionForm from './session_form';
import {signup, login} from '../../actions/session_actions';
import {clearErrors} from '../../actions/clear_actions';
import {openModal, closeModal} from '../../actions/modal_actions';

const mapStateToProps = (state, ownProps) => {
  let formType = (ownProps.match.path === '/login') ? 'login' : 'signup';

  return {
    formType,
    errors: state.errors.session,
    modal: state.ui.modal,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  let action = (ownProps.match.path === '/login') ? login : signup;

  return {
    submitForm: (user) => dispatch(action(user)),
    clearErrors: () => dispatch(clearErrors()),
    // for demo login
    login: (user) => dispatch(login(user)),
    openModal: (modal) => dispatch(openModal(modal)),
    closeModal: () => dispatch(closeModal()),
  };
};

export default connect
  (mapStateToProps, mapDispatchToProps)
  (SessionForm);
