const { createRouter } = require("../utils/routerHelper");
const HttpMethods = require("../utils/httpMethods");
const auth = require("../middlewares/auth");

const { 
  addPost,
  getPostsByUserId,
  getAllPosts
} = require("../controllers/postController");

const routes = [
  {
    method: HttpMethods.POST,
    path: "/users/:userId/post",
    handlers: [ auth, addPost ],   
  },

  {
    method: HttpMethods.GET,
    path: "/users/:userId/get",
    handlers: [ auth, getPostsByUserId ], 
  },

  {
    method: HttpMethods.GET,
    path: "/users/get",
    handlers: [ auth, getAllPosts ], 
  },
];

const router = createRouter(routes);
module.exports = router;
