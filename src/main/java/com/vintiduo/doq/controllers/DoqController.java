package com.vintiduo.doq.controllers;

import com.vintiduo.doq.data.GetAnnotationsRequest;
import com.vintiduo.doq.data.SaveAnnotationRequest;
import com.vintiduo.doq.data.SaveAnnotationResponse;
import com.vintiduo.doq.services.AnnotationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Controller
public class DoqController {

    @Autowired
    AnnotationService annotationService;

    @CrossOrigin
    @RequestMapping(value = "/getAnnotations", method = RequestMethod.POST)
    public @ResponseBody Map<String, String> getAnnotations(
            @RequestBody GetAnnotationsRequest req
    ) {
        return annotationService.getAnnotations(req.getUrl());
    }

    @CrossOrigin
    @RequestMapping(value = "/saveAnnotation", method = RequestMethod.POST)
    public @ResponseBody SaveAnnotationResponse saveAnnotation(@RequestBody SaveAnnotationRequest req
    ) {
        annotationService.saveAnnotation(req.getUrl(), req.getElementIdentifier(), req.getAnnotationData());
        return new SaveAnnotationResponse("ok");
    }
}
