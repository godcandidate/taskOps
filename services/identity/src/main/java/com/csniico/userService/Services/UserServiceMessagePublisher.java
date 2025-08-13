package com.csniico.userService.Services;

import com.csniico.userService.Entity.User;
import com.csniico.userService.dto.UserRequest;
import com.csniico.userService.repository.UserRepository;
import io.micrometer.observation.Observation;
import org.springframework.kafka.support.micrometer.KafkaTemplateObservationConvention;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;

import java.util.concurrent.CompletableFuture;

@Service
public class UserServiceMessagePublisher {
UserRepository userRepository;

    @Autowired
    private KafkaTemplate<String, Object> template;

    public void sendUserCreatedMessageToTopic(UserRequest userRequest) {
        template.setMicrometerEnabled(true);
        template.setObservationEnabled(true);
        template.setObservationConvention(new KafkaTemplateObservationConvention() {
            @Override
            public boolean supportsContext(Observation.Context context) {
                return KafkaTemplateObservationConvention.super.supportsContext(context);
            }
        });
        try {
            CompletableFuture<SendResult<String, Object>> future = template.send("user.created", userRequest);
            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    System.out.println("Sent message=[" + userRequest+ "] with offset=[" + result.getRecordMetadata().offset() + "]");
                } else {
                    System.out.println("Unable to send message=[" + userRequest + "] due to : " + ex.getMessage());
                }
            });
        }
        catch (Exception e) {
            System.out.println("Error sending message to topic: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }
}
