export const checksums = {
  "index": "v3.5.0--z-iWD2iJrIfsd5oov5M6jSr5pNLiGbP-1lLPGKbo9AY",
  "projects": "v3.5.0--w1Bef0WlRGgq1uTUEbLyaBQyWfPZhXrxrZluf_jdsb4",
  "blog": "v3.5.0--OgaYTneWdJhU6Z_LGOeo_iFqvluNqee0whgEJAi4N04",
  "pages": "v3.5.0--td6ZWz6JjzC2Z1oxMZCMwwXhVW7lFbY1nYO90GY5PXM",
  "about": "v3.5.0--W0ToCYAdswxh8N31vInVp04B32966hrSrv297-ePeDM"
}
export const checksumsStructure = {
  "index": "OlB8K-FYQeiOmH_XYZUPmjxYW6W3oRCq3ruT1Br3SAE",
  "projects": "fPMREOruI1oepfApCB9vNqg8eQ42EjGDvAgUbFzMyDg",
  "blog": "PMMhvgGFocAPWVLx3gMtIzP4fDKba6Sbn_0u9hWJAMk",
  "pages": "3IjgIfEEf-jEHsY-RT_ootRkgk4JVF1_40-7S552Cfs",
  "about": "fNWjfi6QK17IkVo_GwVO6TE5eDF4m9P5PE52tFBRB8c"
}

export const tables = {
  "index": "_content_index",
  "projects": "_content_projects",
  "blog": "_content_blog",
  "pages": "_content_pages",
  "about": "_content_about",
  "info": "_content_info"
}

export default {
  "index": {
    "type": "page",
    "fields": {
      "id": "string",
      "title": "string",
      "about": "json",
      "blog": "json",
      "body": "json",
      "description": "string",
      "experience": "json",
      "extension": "string",
      "faq": "json",
      "hero": "json",
      "meta": "json",
      "navigation": "json",
      "path": "string",
      "seo": "json",
      "stem": "string",
      "testimonials": "json"
    }
  },
  "projects": {
    "type": "data",
    "fields": {
      "id": "string",
      "title": "string",
      "date": "date",
      "description": "string",
      "extension": "string",
      "image": "string",
      "meta": "json",
      "stem": "string",
      "tags": "json",
      "url": "string"
    }
  },
  "blog": {
    "type": "page",
    "fields": {
      "id": "string",
      "title": "string",
      "author": "json",
      "body": "json",
      "date": "date",
      "description": "string",
      "extension": "string",
      "image": "string",
      "meta": "json",
      "minRead": "number",
      "navigation": "json",
      "path": "string",
      "seo": "json",
      "stem": "string"
    }
  },
  "pages": {
    "type": "page",
    "fields": {
      "id": "string",
      "title": "string",
      "body": "json",
      "description": "string",
      "extension": "string",
      "links": "json",
      "meta": "json",
      "navigation": "json",
      "path": "string",
      "seo": "json",
      "stem": "string"
    }
  },
  "about": {
    "type": "page",
    "fields": {
      "id": "string",
      "title": "string",
      "body": "json",
      "content": "json",
      "description": "string",
      "extension": "string",
      "images": "json",
      "meta": "json",
      "navigation": "json",
      "path": "string",
      "seo": "json",
      "stem": "string"
    }
  },
  "info": {
    "type": "data",
    "fields": {}
  }
}