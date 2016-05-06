package ru.unc6.promeets.model.service.entity.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ru.unc6.promeets.model.entity.File;
import ru.unc6.promeets.model.entity.User;
import ru.unc6.promeets.model.repository.UserRepository;
import ru.unc6.promeets.model.service.entity.FileService;
import ru.unc6.promeets.model.service.entity.UserService;
import ru.unc6.promeets.security.CustomUserDetails;

import java.security.Principal;
import java.util.List;

/**
 * Created by Vladimir on 20.03.2016.
 */
@Service
public class UserServiceImp extends BaseServiceImpl<User, Long>
        implements UserService {

    @Value("${default-user-image-url}")
    private String defaultUserImageUrl;

    @Value("${default-user-image-name}")
    private String defaultUserImageName;

    private UserRepository userRepository;

    @Autowired
    private FileService fileService;

    @Autowired
    public UserServiceImp(UserRepository repository) {
        super(repository);
        this.userRepository = repository;
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.getUserByEmail(email);
    }

    @Override
    public List<User> getUsersByChatId(long chatId) {
        return (List<User>) userRepository.getUsersByChatId(chatId);
    }

    @Override
    public User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            return ((CustomUserDetails) authentication.getPrincipal()).getUser();
        }
        return null;
    }

    @Override
    public User create(User entity) {
        //Encoding password
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
        entity.setPassword(bCryptPasswordEncoder.encode(entity.getPassword()));

        //Set default image if it's needed
        if (entity.getImage() == null || entity.getImage().getUrl() == null) {
            File image = new File();
            image.setName(defaultUserImageName);
            image.setUrl(defaultUserImageUrl);
            entity.setImage(image);
        }

        fileService.create(entity.getImage());
        return userRepository.save(entity);
    }
}
