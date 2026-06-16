package com.trinhminhvi.techshop.user.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.trinhminhvi.techshop.auth.dto.request.RegisterRequest;
import com.trinhminhvi.techshop.auth.dto.response.RegisterResponse;
import com.trinhminhvi.techshop.user.entity.User;


@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "role", ignore = true)
    User toUser(RegisterRequest request);

    RegisterResponse toRegisterResponse(User user);
}