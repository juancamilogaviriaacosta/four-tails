package co.com.ftails.be.dtos;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class BookingDto {
    private Instant date;
    private String time;
    private String pet;
    private String service;
    private String owner;
    private String color;
}
