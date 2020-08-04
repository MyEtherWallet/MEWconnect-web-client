/* eslint-disable */
// import { Toast } from '@/helpers';
const ERRORS = {};
const WARNING = {};

export default (popUpHandler) => {
  console.log(popUpHandler); // todo remove dev item
  return err => {
    popUpHandler.showNotice('decline');
    console.error(err);
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
