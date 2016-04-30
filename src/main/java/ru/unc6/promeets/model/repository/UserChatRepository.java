package ru.unc6.promeets.model.repository;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ru.unc6.promeets.model.entity.User;
import ru.unc6.promeets.model.entity.UserChat;
import ru.unc6.promeets.model.entity.UserChatPK;

/**
 * Created by Vladimir on 13.04.2016.
 */
public interface UserChatRepository extends CrudRepository<UserChat, UserChatPK> {
    @Query("select userChat.userChatPK.user from UserChat userChat where userChat.userChatPK.chat.chatId=(:chatId)")
    Iterable<User> getUsersByChatId(@Param("chatId") long chatId);

    @Query("select userChat from UserChat userChat where userChat.id.user.userId=(:userId)")
    Iterable<UserChat> getUserChatsByUserId(@Param("userId") long userId);

    @Query("select userChat from UserChat userChat where userChat.id.chat.chatId=(:chatId)")
    Iterable<UserChat> getUserChatsByChatId(@Param("chatId") long chatId);

    @Query("select userChat from UserChat userChat where userChat.id.chat.chatId=(:chatId) and userChat.id.user.userId=(:userId)")
    UserChat getUserChatByUserIdAndChatId(@Param("userId") long userId, @Param("chatId") long chatId);

}