package co.com.ftails.be.dtos;

import co.com.ftails.be.entities.DevicePlatform;

public record RegisterDeviceDto(String token, DevicePlatform platform) {

}
