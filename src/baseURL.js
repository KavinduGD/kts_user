import axios from "axios";

const userAxios = axios.create({
  baseURL: "http://kts-alb-789350784.ap-south-1.elb.amazonaws.com:4000",
});
// baseURL: "http://localhost:4000",
// https://kts-b5lr.onrender.com
export default userAxios;
