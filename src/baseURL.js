import axios from "axios";

const userAxios = axios.create({
  baseURL: "https://kts-backend.kavindu-gihan.tech",
});

export default userAxios;
