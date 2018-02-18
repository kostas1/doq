package com.vintiduo.doq;

import com.vintiduo.doq.data.GetAnnotationsRequest;
import com.vintiduo.doq.data.SaveAnnotationRequest;
import com.vintiduo.doq.data.SaveAnnotationResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Controller
public class DoqController {

    Map<String, Map<String, String>> data = new HashMap<>();

    @CrossOrigin
    @RequestMapping(value = "/getAnnotations", method = RequestMethod.POST)
    public @ResponseBody Map<String, String> getAnnotations(
            @RequestBody GetAnnotationsRequest req
    ) {
        return data.getOrDefault(req.getUrl(), new HashMap<>());
    }

    @CrossOrigin
    @RequestMapping(value = "/saveAnnotation", method = RequestMethod.POST)
    public @ResponseBody SaveAnnotationResponse saveAnnotation(@RequestBody SaveAnnotationRequest req
    ) {
        Map<String, String> annotations = data.getOrDefault(req.getUrl(), new HashMap<>());
        annotations.put(req.getElementIdentifier(), req.getAnnotationData());
        data.put(req.getUrl(), annotations);
        return new SaveAnnotationResponse("ok");
    }
}
