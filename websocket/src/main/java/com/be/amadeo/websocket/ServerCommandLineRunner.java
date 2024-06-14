package com.be.amadeo.websocket;

import com.corundumstudio.socketio.SocketIOServer;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ServerCommandLineRunner implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(ServerCommandLineRunner.class);

    private final SocketIOServer server;


    @Override
    public void run(String... args) throws Exception {
        server.start();
    }
}
