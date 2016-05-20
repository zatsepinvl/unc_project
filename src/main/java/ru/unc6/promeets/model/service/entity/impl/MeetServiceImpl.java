/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ru.unc6.promeets.model.service.entity.impl;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.unc6.promeets.model.entity.Meet;
import ru.unc6.promeets.model.repository.MeetRepository;
import ru.unc6.promeets.model.service.entity.MeetService;
import ru.unc6.promeets.model.service.entity.UserMeetService;
import ru.unc6.promeets.model.service.notification.MeetNotificationService;

import java.util.List;


@Service
public class MeetServiceImpl extends BaseNotifiedServiceImpl<Meet, Long>
        implements MeetService {

    private static final Logger log = Logger.getLogger(MeetServiceImpl.class);

    private MeetRepository meetRepository;


    @Autowired
    private UserMeetService userMeetService;

    @Autowired
    public MeetServiceImpl(MeetRepository repository, MeetNotificationService notificationService) {
        super(repository,notificationService);
        this.meetRepository = repository;
    }

    @Override
    public void delete(Long id) {
        userMeetService.deleteUserMeetsByMeetId(id);
        super.delete(id);
    }

    @Override
    public List<Meet> getMeetsByGroupId(long groupId) {
        return (List<Meet>) meetRepository.getMeetsByGroupId(groupId);
    }
}
