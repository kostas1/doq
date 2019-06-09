package com.vintiduo.doq.data.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Annotation {

  @Id
  @GeneratedValue
  private long id;

  @Column
  private String url;

  @Column
  private String elementIdentifier;

  @Column
  private String data;

  public Annotation() {

  }

  public Annotation(String url, String elementIdentifier, String data) {
    this.url = url;
    this.elementIdentifier = elementIdentifier;
    this.data = data;
  }

  public String getUrl() {
    return url;
  }

  public String getElementIdentifier() {
    return elementIdentifier;
  }

  public String getData() {
    return data;
  }
}
