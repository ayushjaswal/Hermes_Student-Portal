export const path = "https://hermesstudent-portal-production.up.railway.app";

export const config = {
  baseURL: path,
  headers: {
    "Access-Control-Allow-Origin": `${path}`,
  },
  withCredentials: true,
};
console.log(config);
