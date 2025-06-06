package com.web.api;
import com.web.dto.request.BlogRequest;
import com.web.dto.response.BlogResponse;
import com.web.entity.Blog;
import com.web.entity.Category;
import com.web.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/blog")
@CrossOrigin
public class BlogApi {

    @Autowired
    private BlogService blogService;

    @PostMapping("/admin/create-update")
    public ResponseEntity<?> save(@RequestBody BlogRequest blogRequest){
        BlogResponse result = blogService.saveOrUpdate(blogRequest);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/delete")
    public ResponseEntity<?> delete(@RequestParam("id") Long id){
        blogService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/public/findAll")
    public ResponseEntity<?> findAll(Pageable pageable){
        Page<BlogResponse> result = blogService.findAll(pageable);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

    @GetMapping("/public/findById")
    public ResponseEntity<?> findById(@RequestParam("id") Long id){
        BlogResponse result = blogService.findById(id);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

    @GetMapping("/public/best-view")
    public ResponseEntity<?> bestView(){
        List<BlogResponse> result = blogService.bestView();
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

    @GetMapping("/public/find-by-category")
    public ResponseEntity<?> findByCategory(@RequestParam Long categoryId, Pageable pageable){
        Page<Blog> result = blogService.findByCategory(categoryId,pageable);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }

}
