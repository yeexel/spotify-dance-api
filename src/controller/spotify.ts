import { BaseContext } from "koa";

export default class SpotifyController {
  public static async testToken(ctx: BaseContext) {
    console.log("state");
    console.log(ctx.state);
    ctx.body = "HELLO TEST";
  }
}
