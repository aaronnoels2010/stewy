package com.be.amadeo.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class MessageService {

    //private final MessageRepository messageRepository;


    public List<Message> getMessages(String room) {
        return null;
    }

    public Message saveMessage(Message message) {
        return  null;
    }

}
