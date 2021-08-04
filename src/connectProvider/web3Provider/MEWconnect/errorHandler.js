/* eslint-disable */
export default popUpHandler => {
  return err => {
    if (err.reject) {
      popUpHandler.showNotice('decline');
    } else {
      popUpHandler.showNotice('error');
      console.error(err);
    }
  };
};
