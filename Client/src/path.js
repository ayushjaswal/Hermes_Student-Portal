export const path = import.meta.env.VITE_PATH

export const config = {
  host: `${path}`,
  headers: {
    "Access-Control-Allow-Origin": `${path}`,
  },
  withCredentials: true,
};