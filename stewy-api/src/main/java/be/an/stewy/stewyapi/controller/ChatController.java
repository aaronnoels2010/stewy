package be.an.stewy.stewyapi.controller;

import be.an.stewy.stewyapi.Message;
import be.an.stewy.stewyapi.OutputMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class ChatController {
    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public OutputMessage send(Message message) throws Exception {
        Thread.sleep(1000); // simulated delay
        return new OutputMessage(HtmlUtils.htmlEscape(message.getFrom()), HtmlUtils.htmlEscape(message.getText()));
    }
}
