let URLs = {};

if (process.env.NODE_ENV === "production") {
  URLs = {
    baseURL: "/api",
    socketURL: "https://ridewall.herokuapp.com/api",
  };
} else {
  URLs = {
    baseURL: "http://localhost:2001",
    socketURL: "http://localhost:2001",
  };
}

export default URLs;
