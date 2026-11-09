package co.com.ftails.be.services;

import co.com.ftails.be.dtos.RegisterDeviceDto;
import co.com.ftails.be.entities.User;
import co.com.ftails.be.entities.UserDevice;
import co.com.ftails.be.repositories.UserDeviceRepository;
import co.com.ftails.be.repositories.UserRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class UserDeviceService {

    private final UserDeviceRepository deviceRepository;
    private final UserRepository ur;

    @Transactional
    public void register(User user, RegisterDeviceDto request) {
        UserDevice device = deviceRepository.findByToken(request.token()).orElseGet(UserDevice::new);
        device.setUser(user);
        device.setToken(request.token());
        device.setPlatform(request.platform());
        device.setActive(true);
        deviceRepository.save(device);
    }

    public void register(RegisterDeviceDto registerDeviceDto, Authentication authentication) {
        User user = ur.findByEmail(authentication.getName()).orElseThrow();
        register(user, registerDeviceDto);
    }
}
