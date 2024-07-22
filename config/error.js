const CONFIG_MESSAGE_ERRORS = {
    INVALID: {
      type: "INVALID",
      status: 400,
    },
    ALREADY_EXIST: {
      type: "ALREADY_EXIST",
      status: 409,
    },
    GET_SUCCESS: {
      type: "SUCCESS",
      status: 200,
    },
    ACTION_SUCCESS: {
      type: "SUCCESS",
      status: 201,
    },
    UNAUTHORIZED: {
      type: "UNAUTHORIZED",
      status: 401,
    },
    INTERNAL_ERROR: {
      type: "INTERNAL_SERVER_ERROR",
      status: 500,
    },
};

module.exports = CONFIG_MESSAGE_ERRORS