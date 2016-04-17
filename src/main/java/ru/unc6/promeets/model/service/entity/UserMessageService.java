package ru.unc6.promeets.model.service.entity;

import ru.unc6.promeets.model.entity.Message;
import ru.unc6.promeets.model.entity.UserMessage;
import ru.unc6.promeets.model.entity.UserMessagePK;

import java.util.List;

/**
 * Created by Vladimir on 12.04.2016.
 */
public interface UserMessageService extends BaseService<UserMessage, UserMessagePK> {

    UserMessage getUserMessageByUserIdAndMessageId(long userId, long messageId);

    List<UserMessage> getUserMessagesByUserIdAndChatId(long userId, long chatId, int page);

    List<UserMessage> getNewUserMessagesByUserId(long userId);

    void deleteUserMessagesByChatId(long chatId);

    void createUserMessagesByMessage(Message message);

}
