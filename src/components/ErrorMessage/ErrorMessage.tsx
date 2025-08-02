// Styles
import css from "./ErrorMessage.module.css";

const ErrorMessage = () => {
  console.log("render ErrorMessage");

  return <p className={css.text}>There was an error, please try again...</p>;
};

export default ErrorMessage;
