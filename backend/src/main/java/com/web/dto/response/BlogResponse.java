package com.web.dto.response;

import com.web.entity.Category;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.sql.Time;

@Getter
@Setter
public class BlogResponse {

    private Long id;

    private Date createdDate;

    private Time createdTime;

    private String title;

    private String description;

    private String content;

    private String image;

    private Integer numView;

    private Category category;

    private UserResponse user;
}
