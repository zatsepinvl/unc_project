/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ru.unc6.promeets.model.service.webrtc;

import java.security.Principal;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.unc6.promeets.controller.AppSTOMPController;
import ru.unc6.promeets.model.entity.User;
import ru.unc6.promeets.model.repository.UserMeetRepository;
import ru.unc6.promeets.model.service.entity.UserService;

/**
 *
 * @author MDay
 */
@Service
public class WebRtcSignalServiceImpl implements WebRtcSignalService
{
    @Autowired
    UserService userService;
    
    @Autowired
    AppSTOMPController appSTOMPController;
    
    @Override
    public void signalRTCByMeetId(WebRtcSignalMessage message, Principal principal)
    {
        User currentUser = userService.getUserByEmail(principal.getName());
        message.setSuserId(currentUser.getUserId());
        
        appSTOMPController.sendRtcSignalMessage(message);
    }
}
