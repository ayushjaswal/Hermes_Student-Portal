export const path = import.meta.env.VITE_PATH

export const config = {
  baseURL: path,
  headers: {
    "Access-Control-Allow-Origin": `${path}`,
  },
  withCredentials: true,
};
console.log(config)