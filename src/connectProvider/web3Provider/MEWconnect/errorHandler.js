/* eslint-disable */
// import { Toast } from '@/helpers';
const ERRORS = {};
const WARNING = {};

export default (popUpHandler) => {
  return err => {
    if(err.reject){
      popUpHandler.showNotice('decline');
    } else {
      popUpHandler.showNotice('error');
      console.error(err);
    }

  }
  // const errorValues = Object.values(ERRORS);
  // const warningValues = Object.values(WARNING);
  // if (errorValues.includes(err.message)) {
  //   Toast.responseHandler(err, Toast.ERROR);
  // } else if (warningValues.includes(err.message)) {
  //   Toast.responseHandler(err, Toast.WARN);
  // } else {
  //   Toast.responseHandler(err, false);
  // }
};
