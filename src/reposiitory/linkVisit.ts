import { Repository, EntityRepository } from "typeorm";
import { LinkVisit } from "../entity/linkVisit";

@EntityRepository(LinkVisit)
export class LinkVisitRepository extends Repository<LinkVisit> {}
