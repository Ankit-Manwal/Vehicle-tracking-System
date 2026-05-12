import axios from "axios"

const API = axios.create({
  baseURL: "http://localhost:5000"
})

export const getVehicle = async (plate) => {
  const res = await API.get(`/vehicle/${plate}`)
  return res.data
}

export const signup = async (username, password) => {
  return API.post("/signup", { username, password })
}

export const login = async (username, password) => {
  return API.post("/login", { username, password })
}
