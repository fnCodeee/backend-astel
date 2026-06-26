/**
 * API Endpoints Constants
 * Centralized definition of all API routes for consistent reference across the application
 */

export const API_ENDPOINTS = {
  // AUTH ENDPOINTS
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
  },

  // PROFILE ENDPOINTS
  PROFILES: {
    GET_ME: "/profiles/me",
    UPDATE_ME: "/profiles/me",
  },

  // POST ENDPOINTS
  POSTS: {
    GET_DETAIL: "/posts/:postId",
    GET_ALL: "/posts",
    CREATE: "/posts",
    UPDATE: "/posts/:postId",
    DELETE: "/posts/:postId",
    LIKE: "/posts/:postId/like",
    UNLIKE: "/posts/:postId/unlike",
    COMMENTS: {
      CREATE: "/posts/:postId/comments",
      GET_ALL: "/posts/:postId/comments",
      DELETE: "/delete/comments/:commentId",
    },
  },

  // COLLAB ENDPOINTS
  COLLAB: {
    GET_ALL: "/collab",
    GET_MY_POSTS: "/collab/me",
    GET_DETAIL: "/collab/:id",
    CREATE: "/collab",
    UPDATE: "/collab/:id",
    DELETE: "/collab/:id",
  },

  // SKILLS ENDPOINTS
  SKILLS: {
    GET_ALL: "/skills",
  },

  // APPLICATION ENDPOINTS
  APPLICATIONS: {
    GET_APPLICANTS: "/collab/:collabId/applications",
    GET_MY_APPLICATIONS: "/myapplications",
    GET_MY_APPLICATION_DETAIL: "/myapplications/:applicationId",
    APPLY: "/collab/:collabId/applications",
    ACCEPT: "/collab/applications/:applicationId/accept",
    REJECT: "/collab/applications/:applicationId/reject",
  },
};

/**
 * HTTP Methods
 */
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
};

export default API_ENDPOINTS;
