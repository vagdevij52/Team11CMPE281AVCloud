let URLs = {};

if (process.env.NODE_ENV === "production") {
  URLs = {
    baseURL: "/api",
    socketURL: "https://ridewall.herokuapp.com/api",
  };
} else {
  URLs = {
    baseURL: "http://localhost:3001",
    socketURL: "http://localhost:3001",
  };
}

export default URLs;
