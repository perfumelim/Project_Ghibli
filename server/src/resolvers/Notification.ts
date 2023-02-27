import { MyContext } from "../apollo/createApolloServer";
import Notification from "../entities/Notification";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { Arg, Ctx, Mutation, Int, Query, Resolver, UseMiddleware, Subscription, Root, PubSub, Publisher } from "type-graphql";

@Resolver(Notification)
export class NotificationResolver {
  @UseMiddleware(isAuthenticated)
  @Query(()=> [Notification], {
    description: '세션에 해당되는 유저의 모든 알림을 가져옵니다.'
  })
  async notifications(
    @Ctx() {verifiedUser}: MyContext
  ): Promise<Notification[]> {
    const notifications = await Notification.find({
      where: {userId: verifiedUser.userId},
      order: {createdAt: "DESC"}
    });
    return notifications;
  }

  @UseMiddleware(isAuthenticated)
  @Mutation(() => Notification)
  async createNotification(
    @Arg('userId', () => Int) userId: number,
    @Arg('text') text: string,
    @PubSub('NOTIFICATION_CREATED') publish: Publisher<Notification>,
  ): Promise<Notification> {
    const newNoti = await Notification.create({
      text,
      userId,
    }).save();
    await publish(newNoti);
    return newNoti;
  }

  @Subscription({topics: 'NOTIFICATION_CREATED'})
  newNotification(
    @Root() notificationPayload: Notification
  ): Notification {
    return notificationPayload;
  }
}