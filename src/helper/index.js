const isRegularURL = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const defaultValue = [
  {
    insert: "abc 123123123",
  },
  {
    insert: "\n",
  },
  {
    attributes: {
      underline: true,
      bold: true,
    },
    insert: "123",
  },
  {
    insert: "\n",
  },
  {
    insert: {
      image:
        "https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp",
    },
  },
  {
    insert: "\n",
  },
  {
    insert: {
      video: "https://www.youtube.com/embed/ddaEtFOsFeM?si=OZgw-reIv5el22Mt",
    },
  },
];

const formats = [
  // "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  // "bullet",
  // "indent",
  "link",
  "image",
  "video",
  // "color",
  // "background",
  "size",
  "emoji",
];

const fetchFile = async (dataURL) => {
  const res = await fetch(dataURL);
  const blob = await res.blob();
  return new File([blob], "file", { type: blob.type });
};

const regexHashtag = /#[\w\u00C0-\u024F]+/g;

export { defaultValue, fetchFile, formats, isRegularURL, regexHashtag };
