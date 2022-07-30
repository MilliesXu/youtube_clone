import axios from 'axios'

const base = process.env.NEXT_PUBLIC_API_ENDPOINT
const userBase = `${base}/api/user/`
const authBase = `${base}/api/auth/`

export const registerUser = async (payload: {
  username: string,
  email: string,
  password: string,
  confirmPassword: string
}) => {
  return await axios.post(userBase, payload).then((res) => res.data)
}

export const loginUser = async (payload: {
  email: string,
  password: string,
}) => {
  return await axios.post(authBase, payload, { withCredentials: true }).then((res) => res.data)
}

export const getMe = async () => {
  return await axios.get(userBase, { withCredentials: true })
    .then((res) => res.data)
    .catch(() => null)
}
