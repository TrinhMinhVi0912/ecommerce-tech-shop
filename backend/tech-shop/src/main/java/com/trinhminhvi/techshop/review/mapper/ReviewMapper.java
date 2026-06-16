package com.trinhminhvi.techshop.review.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.trinhminhvi.techshop.review.dto.response.AddReviewResponse;
import com.trinhminhvi.techshop.review.dto.response.UpdateReviewResponse;
import com.trinhminhvi.techshop.review.entity.Review;

@Mapper(componentModel = "spring")
public interface ReviewMapper {
    @Mapping(source = "user.userName",target = "userName")
    @Mapping(source = "user.avatarPath", target = "avatarPath")
    AddReviewResponse toAddReviewResponse(Review review);


    
    @Mapping(source = "user.userName",target = "userName")
    @Mapping(source = "user.avatarPath", target = "avatarPath")
    UpdateReviewResponse toUpdateReviewResponse(Review review);

}
