import { FunctionComponent, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import './login.css'

import AuthService from "../../services/auth.service";
import { useNavigate } from "react-router";

const Login: FunctionComponent = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const navigate = useNavigate();

  const validationSchema = () => {
    return Yup.object().shape({
      username: Yup.string().required("This field is required!"),
      password: Yup.string().required("This field is required!"),
    });
  }

  const handleLogin = (formValue: { username: string; password: string }) => {
    const { username, password } = formValue;
    setMessage('');
    setLoading(true);

    AuthService.login(username, password)
    .then(response => response.json())
    .then(response => {
      console.log(response);
      if (response.accessToken) {
        localStorage.setItem("user", JSON.stringify(response));
        navigate("/");
      }
    })
    .catch(error => {
      console.log("We got error when logging in!!!");
      console.log(error); 
      const resMessage =
      (error.response &&
        error.response.data &&
        error.response.data.message) ||
      error.message ||
      error.toString();

      setLoading(false);
      setMessage(resMessage);
    });
  }

  

  const initialValues = {
    username: "",
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
            onSubmit={handleLogin}
          >
            <Form>
              <div className="form-group input-field">
                <label htmlFor="username">Username</label>
                <Field name="username" type="text" className="form-control" />
              </div>

              <div className="form-group input-field">
                <label htmlFor="password">Password</label>
                <Field name="password" type="password" className="form-control" />
              </div>

              <div className="form-group">
                <button type="submit" className="glass-button" disabled={loading}>
                  {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <span>Login</span>
                </button>
              </div>
            </Form>
          </Formik>
        </div>
        <div className="hr">OR</div>
        <div>
          <a className="glass-button" href="/register">Register</a>
        </div>
      </div>
    </div>
  );
}

export default Login;