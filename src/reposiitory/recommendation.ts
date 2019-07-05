import { Recommendation } from "../entity/recommendation";
import { Repository, EntityRepository, createQueryBuilder } from "typeorm";

@EntityRepository(Recommendation)
export class RecommendationRepository extends Repository<Recommendation> {
  async getCurrentDayData(userId: string) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    return createQueryBuilder()
      .select()
      .from(Recommendation, "recommendations")
      .where("recommendations.user_id = :userId", { userId })
      .andWhere(
        `recommendations.created_at BETWEEN '${start.toISOString()}' AND '${end.toISOString()}'`
      )
      .getRawMany();
  }
}
