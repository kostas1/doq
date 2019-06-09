package com.vintiduo.doq.services;

import com.vintiduo.doq.data.entities.Annotation;
import com.vintiduo.doq.data.repositories.AnnotationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnnotationService {

  @Autowired
  AnnotationRepository annotationRepository;

  public Map<String, String> getAnnotations(String url) {
    List<Annotation> annotations = annotationRepository.findAllByUrl(url);
    Map<String, String> data = new HashMap<>();

    for (Annotation annotation: annotations) {
      data.put(annotation.getElementIdentifier(), annotation.getData());
    }

    return data;
  }

  public void saveAnnotation(String url, String elementIdentifier, String annotationData) {
    Annotation annotation = new Annotation(url, elementIdentifier, annotationData);

    annotationRepository.save(annotation);
  }
}
