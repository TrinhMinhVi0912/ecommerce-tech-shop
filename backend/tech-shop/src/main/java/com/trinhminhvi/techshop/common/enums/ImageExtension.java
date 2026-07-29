package com.trinhminhvi.techshop.common.enums;

import java.util.Arrays;

public enum ImageExtension {

    JPG("jpg"),
    JPEG("jpeg"),
    PNG("png"),
    WEBP("webp");

    private final String extension;

    ImageExtension(String extension) {
        this.extension = extension;
    }

    public String getExtension() {
        return extension;
    }

    public static boolean isSupported(String extension) {
        return Arrays.stream(values())
                .anyMatch(e -> e.extension.equalsIgnoreCase(extension));
    }
}