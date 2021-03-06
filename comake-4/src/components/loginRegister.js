import React, { useState } from "react";
import { connect } from "react-redux";
import Loader from "react-loader-spinner";
import { useHistory, withRouter } from "react-router-dom";
import styled from 'styled-components';

import { loginAction, registerAction } from "../store/actions";
import { axiosWithAuth } from "../utils/axiosWithAuth";


const NewButton = styled.button `
  cursor: pointer;
  background-color: #8A2BE2;
  width: 180px;
  color: #fff;
  padding: 8px 11px;
  fontsize: 1.4rem;
  font-family: 'Montserrat', sans-serif; 
`
const NewForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 90%;
  margin: 0 auto;
`

const initialState = {
  username: "",
  password: "",
};

const Login = (props) => {
  // console.log({ props })
  const { push } = useHistory();
  const [login, setLogin] = useState(initialState);

  const handleChange = (e) => {
    e.preventDefault();
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    });
  };

  const userLogin = (e) => {
    e.preventDefault();
    // props.loginAction(login)
    axiosWithAuth()
      .post("/login", login)
      .then((res) => {
        localStorage.setItem("token", JSON.stringify(res.data.token));
        localStorage.setItem("userID", res.data.user.id);
        console.log({ res });
        props.loginAction(res);
        push("/main");
      })
      .catch((err) => {
        console.log(err);
        alert("Please enter a valid username and password, or register a new account.")
      });
  };
  const userRegister = (e) => {
    e.preventDefault();

    axiosWithAuth()
      .post("/register", login)
      .then((res) => {
        localStorage.setItem("token", JSON.stringify(res.data.token));
        localStorage.setItem("userID", res.data.user.id);

        console.log({ res });
        props.registerAction(res);
        push("/userProfile");
      })
      .catch((err) => {
        console.log(err);
        alert("There was an error. Please try again.")
        // console.log({err})
      });
  };

  return (
    <>
      {props.isFetching && (
        <Loader type="Grid" color="#00BFFF" height={80} width={80} />
      )}
      <h3 className='loginH3'> Login or Register</h3>
      <NewForm>
        <input
          label="Username"
          type="text"
          name="username"
          placeholder="username"
          value={login.username}
          onChange={handleChange}
        />
        <br />
        <input
          label="Password"
          type="password"
          name="password"
          placeholder="password"
          value={login.password}
          onChange={handleChange}
        />

        <NewButton onClick={userLogin}>Login</NewButton>
        <NewButton onClick={userRegister}>Register</NewButton>
      </NewForm>
    </>
  );
};

const mapStateToProps = (state) => {
  console.log(state.user);
  return {
    username: state.user.username,
    isFetching: state.user.isFetching,
    error: state.user.error,
  };
};

export default withRouter(
  connect(mapStateToProps, { loginAction, registerAction })(Login)
);
