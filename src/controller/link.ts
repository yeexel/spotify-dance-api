import { BaseContext } from "koa";
import { Link } from "../entity/link";
import { config } from "../config";
import { getCustomRepository, QueryFailedError } from "typeorm";
import { LinkRepository } from "../reposiitory/link";

export default class LinkController {
  public static async create(ctx: BaseContext) {
    const linkRepository = getCustomRepository(LinkRepository);
    const requestBody = ctx.request.body;

    let link = new Link();

    link.is_active = true;
    link.user_id = ctx.state.user.id;
    link.name = requestBody.name;
    link.playlist_id = requestBody.id;
    link.public_id = await generatePublicId();

    try {
      link = await linkRepository.save(link);
    } catch (e) {
      if (e instanceof QueryFailedError) {
        // ctx.status = 422;
        // ctx.res.end(
        //   JSON.stringify({
        //     error: true,
        //     msg: "Link already exists for given playlist."
        //   })
        // );
        link = await linkRepository.findOne({ playlist_id: requestBody.id });
      }
    }

    const linkUrl =
      config.nodeEnv === "dev"
        ? `http://localhost:3000/s/${link.public_id}`
        : `https://playlista.co/s/${link.public_id}`;

    ctx.body = { link: linkUrl };
  }

  public static async list(ctx: BaseContext) {
    const linkRepository = getCustomRepository(LinkRepository);

    let list = await linkRepository.find({
      order: { created_at: "DESC" },
      relations: ["visits"],
      where: { user_id: ctx.state.user.id }
    });

    list = list.map(listItem => {
      const visitCount = listItem.visits.length;

      // @ts-ignore
      listItem.visit_count = visitCount;

      delete listItem.visits;

      return listItem;
    });

    ctx.body = list;
  }
}

const makeid = length => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const generatePublicId = async () => {
  const linkRepository = getCustomRepository(LinkRepository);

  let id = makeid(9);

  const link = await linkRepository.findOne({ where: { public_id: id } });

  if (link) {
    id = await generatePublicId();
  }

  return id;
};
