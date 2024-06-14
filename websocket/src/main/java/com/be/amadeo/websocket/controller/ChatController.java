package com.be.amadeo.websocket.controller;

import com.be.amadeo.websocket.Message;
import com.be.amadeo.websocket.OutputMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class ChatController {
    @MessageMapping("/ws")
    @SendTo("/topic/messages")
    public OutputMessage send(Message message) throws Exception {
        Thread.sleep(1000); // simulated delay
        return new OutputMessage(HtmlUtils.htmlEscape(message.getUsername()), HtmlUtils.htmlEscape(message.getContent()));
    }
}
