package com.be.amadeo.websocket;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OutputMessage {
    private String from;
    private String text;

    public OutputMessage(String from, String text) {
        this.from = from;
        this.text = text;
    }

}
