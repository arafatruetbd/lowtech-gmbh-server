"use strict";

module.exports = (requiredScopes) => {
  return async (request, h) => {
    const userScopes = request.auth.credentials.scopes;

    // Check if the user has the required scopes
    const hasRequiredScopes = requiredScopes.every((scope) =>
      userScopes.includes(scope)
    );

    if (!hasRequiredScopes) {
      return h
        .response({
          error: "Forbidden: You do not have the required permissions",
        })
        .code(403);
    }

    return h.continue;
  };
};
