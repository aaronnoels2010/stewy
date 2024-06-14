package be.an.stewy.stewyapi.utils;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public abstract class ZoneDateTime {
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    ;

    public static ZonedDateTime mapStringToZoneDateTime(String zonedDateTime) {
        LocalDateTime localDateTime = LocalDateTime.parse(zonedDateTime, FORMATTER);
        return localDateTime.atZone(ZoneId.systemDefault()); // Or specify a different time zone
    }
}
