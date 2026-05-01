import axios from "axios"

const API = axios.create({
  baseURL: "http://localhost:5000"
})

export const getVehicle = async (plate) => {
  const res = await API.get(`/vehicle/${plate}`)
  return res.data
}