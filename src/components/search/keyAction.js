import keyCodes from './../../constants/keyCodes';
import routes from './../../constants/routes';
import regex from './../../utils/regex';

export default (event, history) => {
  if (event.which === keyCodes.enter) {
    const { value } = event.target;

    if (value.match(regex.address)) {
      history.push(`${routes.account.long}/${value}`);
    }

    if (value.match(regex.transactionId)) {
      // TODO: will be implemented in #246
      history.push('/');
    }

    // TODO: case of no match
  }
};
