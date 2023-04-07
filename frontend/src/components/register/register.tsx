import { FunctionComponent, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./register.css";
import AuthService from "../../services/auth.service";
import { useNavigate } from "react-router-dom";

const Register: FunctionComponent = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [successful, setSuccessful] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();
  
  const validationSchema = () => {
    return Yup.object().shape({
      username: Yup.string()
        .test(
          "len",
          "The username must be between 3 and 20 characters.",
          (val: any) =>
            val &&
            val.toString().length >= 3 &&
            val.toString().length <= 20
        )
        .required("This field is required!"),
      password: Yup.string()
        .test(
          "len",
          "The password must be between 6 and 40 characters.",
          (val: any) =>
            val &&
            val.toString().length >= 6 &&
            val.toString().length <= 40
        )
        .required("This field is required!"),
    });
  }

  const handleRegister = (formValue: { username: string; email: string; password: string }) => {
    const { username, password } = formValue;

    setMessage("");
    setSuccessful(false);

    AuthService.register(
      username,
      password
    )
      .then(response => response.json())
      .then(response => {
        if (response.accessToken) {
          localStorage.setItem("user", JSON.stringify(response));
          navigate("/");
        }
      })
      .catch(err => {
        const resMessage =
          (err.response &&
            err.response.data &&
            err.response.data.message) ||
          err.message ||
          err.toString();

        setMessage(resMessage);
        setSuccessful(false);
      });
  }


  const initialValues = {
    username: "",
    email: "",
    password: "",
  };

  return (
    <div className="glass-container login-container">
      <div className="col-md-12">
        <div className="image-container">
          <img src="/images/2023/logo/ESC2023_Ukraine_LIVERPOOL_RGB_White.png" alt="logo"></img>
        </div>
        <div className="card card-container">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleRegister}
          >
            <Form>
              {!successful && (
                <div>
                  <div className="form-group input-field">
                    <label htmlFor="username"> Username </label>
                    <Field name="username" type="text" className="form-control" />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>
                  <div className="form-group input-field">
                    <label htmlFor="password"> Password </label>
                    <Field
                      name="password"
                      type="password"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <button type="submit" className="glass-button">Sign Up</button>
                  </div>
                </div>
              )}

              {message && (
                <div className="form-group">
                  <div
                    className={
                      successful ? "alert alert-success" : "alert alert-danger"
                    }
                    role="alert"
                  >
                    {message}
                  </div>
                </div>
              )}
            </Form>
          </Formik>
        </div>
        <div className="hr">OR</div>
        <div>
          <a className="glass-button" href="/login">LOGIN</a>
        </div>
      </div>
    </div>
  );
}

export default Register;