import * as jsonwebtoken from "jsonwebtoken";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../reposiitory/user";

export default (opts: { secret?: string } = {}) => {
  const secret = opts.secret;

  const middleware = async function jwt(ctx, next) {
    // If there's no secret set, toss it out right away
    if (!secret) ctx.throw(401, "INVALID_SECRET");

    // Grab the token
    const token = getJwtToken(ctx);

    try {
      // Try and decode the token asynchronously
      const decoded: any = await jsonwebtoken.verify(
        token,
        process.env.JWT_SECRET
      );

      if (decoded.exp < Date.now() / 1000) {
        ctx.throw({
          name: "TokenExpiredError"
        });
      }

      const userRepository = getCustomRepository(UserRepository);
      const user = await userRepository.findOne(decoded.data.user_id);

      ctx.state.user = user;
    } catch (error) {
      // If it's an expiration error, let's report that specifically.
      if (error.name === "TokenExpiredError") {
        ctx.throw(401, "TOKEN_EXPIRED");
      } else {
        ctx.throw(401, "AUTHENTICATION_ERROR");
      }
    }

    return next();
  };

  function getJwtToken(ctx) {
    if (!ctx.header || !ctx.header.authorization) {
      return;
    }

    const parts = ctx.header.authorization.split(" ");

    if (parts.length === 2) {
      const scheme = parts[0];
      const credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        return credentials;
      }
    }
    return ctx.throw(401, "AUTHENTICATION_ERROR");
  }

  return middleware;
};
