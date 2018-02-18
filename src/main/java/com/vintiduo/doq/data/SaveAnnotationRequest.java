package com.vintiduo.doq.data;

public class SaveAnnotationRequest {

    private String url;
    private String elementIdentifier;
    private String annotationData;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getElementIdentifier() {
        return elementIdentifier;
    }

    public void setElementIdentifier(String elementIdentifier) {
        this.elementIdentifier = elementIdentifier;
    }

    public String getAnnotationData() {
        return annotationData;
    }

    public void setAnnotationData(String annotationData) {
        this.annotationData = annotationData;
    }
}
