package com.vintiduo.doq.data.repositories;

import com.vintiduo.doq.data.entities.Annotation;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Map;

public interface AnnotationRepository extends CrudRepository<Annotation, Long> {

  List<Annotation> findAllByUrl(String url);
}
