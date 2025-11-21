const { createRouter } = require("../utils/routerHelper");
const HttpMethods = require("../utils/httpMethods");
const { 
  uploadPostImageMiddleware, 
  createPost ,
  getPosts
} = require("../controllers/postController");

const routes = [
  {
    method: HttpMethods.POST,
    path: "/post",
    handlers: [uploadPostImageMiddleware, createPost],
  },

  {
    method: HttpMethods.GET,
    path: "/posts",
    handlers: [getPosts],

  }
];

const router = createRouter(routes);
module.exports = router;
