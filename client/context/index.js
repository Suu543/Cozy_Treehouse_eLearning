import { useEffect, useReducer, createContext } from "react";
import axios from "axios";
import { useRouter, userRouter } from "next/router";

// Initial State
const initialState = {
  user: null,
};

// Create Context
const Context = createContext();

// Root Reducer
const rootReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    default:
      return state;
  }
};

// context provider
const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  // router
  const router = useRouter();

  useEffect(() => {
    dispatch({
      type: "LOGIN",
      payload: JSON.parse(window.localStorage.getItem("user")),
    });
  }, []);

  axios.interceptors.response.use(
    function (response) {
      // any status code that lie within the range of 2XX cause this function to trigger
      return response;
    },
    function (error) {
      // any status code that falls outside the range of 2XX cause this function to trigger
      let res = error.response;
      if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
        return new Promise((resolve, reject) => {
          axios
            .get("/api/logout")
            .then((data) => {
              console.log("/401 error > logout");
              dispatch({ type: "LOGOUT" });
              window.localStorage.removeItem("user");
              router.push("/login");
            })
            .catch((err) => {
              console.log("AXIOS INTERCEPTORS ERR", err);
              reject(err);
            });
        });
      }

      return Promise.reject(error);
    }
  );

  // csrf token will be included in axios header by default
  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get("/api/csrf-token");
      // console.log("CSRF", data);
      // Later if you post, put, delete router, you can try to change this to other thing, you will get an error if it does not match with the value that server has generated
      // axios.defaults.headers["X-CSRF-Token"] = 'dadsad' Error Occurred;
      axios.defaults.headers["X-CSRF-Token"] = data.getCsrfToken;
    };

    getCsrfToken();
  }, []);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export { Context, Provider };
