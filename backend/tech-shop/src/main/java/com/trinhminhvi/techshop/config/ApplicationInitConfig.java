package com.trinhminhvi.techshop.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.trinhminhvi.techshop.user.entity.User;
import com.trinhminhvi.techshop.user.repository.UserRepository;

@Configuration
public class ApplicationInitConfig {
    // @Bean
    // ApplicationRunner applicationRunner(UserRepository userRepository){
    //     return args -> {
    //         if(userRepository.findByName("admin").isEmpty()){
    //             User user = User.builder()
    //             .email()
    //             .build()
    //         }
    //     }
    // }
}
