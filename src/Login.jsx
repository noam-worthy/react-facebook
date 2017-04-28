import PropTypes from 'prop-types';
import Process from './Process';

export default class Login extends Process {
  static propTypes = {
    ...Process.propTypes,
    scope: PropTypes.string.isRequired,
    fields: PropTypes.array.isRequired,
    onError: PropTypes.func.isRequired,
    onResponse: PropTypes.func.isRequired,
    onReady: PropTypes.func,
    returnScopes: PropTypes.bool,
    rerequest: PropTypes.bool,
  };

  static defaultProps = {
    ...Process.propTypes,
    scope: '',
    fields: ['id', 'first_name', 'last_name', 'middle_name',
      'name', 'email', 'locale', 'gender', 'timezone', 'verified', 'link'],
    returnScopes: false,
    rerequest: false,
    onReady: undefined,
  };

  async process(facebook) {
    const { scope, fields, returnScopes, rerequest } = this.props;
    const loginQpts = { scope };

    if (returnScopes) {
      loginQpts.return_scopes = true;
    }

    if (rerequest) {
      loginQpts.auth_type = 'rerequest';
    }

    const response = await facebook.login(loginQpts);
    if (response.status !== 'connected') {
      throw new Error('Unauthorized user');
    }

    return facebook.getTokenDetailWithProfile({ fields });
  }
}
