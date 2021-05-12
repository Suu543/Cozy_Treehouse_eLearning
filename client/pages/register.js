/*
 * Register.js
 * Collect User's name, email, and password to register
 * then send to backend to save in Database
 */
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";

const Register = () => {
  const [name, setName] = useState("Yongsu");
  const [email, setEmail] = useState("jos50275266@gmail.com");
  const [password, setPassword] = useState("oo101010");
  const [loading, setLoading] = useState(false);

  const {
    state: { user },
  } = useContext(Context);

  // console.log("TESTING ENV", process.env.NEXT_PUBLIC_API);
  const router = useRouter();

  useEffect(() => {
    if (user !== null) router.push("/");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await axios.post(`/api/register`, {
        name,
        email,
        password,
      });
      // toast(...) Rainbow Color
      toast.success("Registration Successful. Please Login.");
      setLoading(false);
    } catch (err) {
      // toast(err.response.data); Rainbow Color
      toast.error(err.response.data);
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="jumbotron text-center bg-primary square p-4">Register</h1>
      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-4 p-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Name"
            required
          />

          <input
            type="email"
            className="form-control mb-4 p-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            required
          />

          <input
            type="password"
            className="form-control mb-4 p-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            required
          />

          <br />
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={!name || !email || !password || loading}
          >
            {loading ? <SyncOutlined spin /> : "Submit"}
          </button>
        </form>

        <p className="text-center p-3">
          Already Registered?
          <Link href="/login">
            <a>Login</a>
          </Link>
        </p>
      </div>
    </>
  );
};

export default Register;
