const { createRouter } = require("../utils/routerHelper");
const HttpMethods = require("../utils/httpMethods");

const { signup, login } = require("../controllers/loginController");

const routes = [
  {
    method: HttpMethods.POST,
    path: "/signup",
    handlers: [signup],
  },
  {
    method: HttpMethods.POST,
    path: "/login",
    handlers: [login],
  },
];

const router = createRouter(routes);

module.exports = router;
