import { Repository, EntityRepository } from "typeorm";
import { Link } from "../entity/link";

@EntityRepository(Link)
export class LinkRepository extends Repository<Link> {}
