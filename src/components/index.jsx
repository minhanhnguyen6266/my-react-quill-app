import { useCallback, useEffect, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import Delta from "quill-delta";
import { Box, Button } from "@mui/material";
import {
  defaultValue as data,
  fetchFile,
  formats,
  isRegularURL,
  regexHashtag,
} from "../helper/index";
import quillEmoji from "react-quill-emoji";
import "react-quill-emoji/dist/quill-emoji.css";
import Toolbar from "./Toolbar";
import Loading from "./Loading";

// Register emoji
Quill.register(
  {
    "formats/emoji": quillEmoji.EmojiBlot,
    "modules/emoji-toolbar": quillEmoji.ToolbarEmoji,
  },
  true
);

// Register link whitelist format video
const Video = Quill.import("formats/video");
const originalSanitize = Video.sanitize;
Video.sanitize = function (url) {
  if (url.startsWith("blob:")) {
    return url;
  }
  return originalSanitize ? originalSanitize(url) : url;
};
Quill.register(Video, true);
const defaultValue = new Delta(data);

export default function MyQuill() {
  const quillRef = useRef(null);
  const [value, setValue] = useState(defaultValue);
  const [htmlPreview, setHtmlPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hashtags, setHashtags] = useState([]);

  const uploadToCloudinary = async (file) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "First_time_using");
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dp4wtauci/upload`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    const url = data.url;
    setIsLoading(false);
    return url;
  };

  const videoHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "video/*");
    input.click();
    input.onchange = () => {
      if (input.files) {
        const file = input.files[0];
        const blobUrl = URL.createObjectURL(file);
        const quill = quillRef.current;
        if (quill) {
          const range = quill.getEditorSelection();
          if (range) {
            quill.getEditor().insertEmbed(range.index, "video", blobUrl);
            quill.getEditor().setSelection(range.index + 1);
          }
        }
      }
    };
  }, []);

  const modules = {
    toolbar: {
      container: "#toolbar",
      handlers: {
        video: videoHandler,
      },
    },
    "emoji-toolbar": true,
  };

  const handleChange = (content, delta, source, editor) => {
    setValue(editor.getContents());
    setHtmlPreview(editor.getHTML());

    const text = editor.getText();
    const matches = text.match(regexHashtag);
    setHashtags(matches || []);
  };

  const handleSubmit = async () => {
    const newDelta = value.reduce(async (accDeltaPromise, op) => {
      const accDelta = await accDeltaPromise;

      if (op.insert && typeof op.insert === "object") {
        if (op.insert.image && !isRegularURL(op.insert.image)) {
          const file = await fetchFile(op.insert.image);
          const url = await uploadToCloudinary(file);
          accDelta.push({ insert: { image: url } });

          //
        } else if (op.insert.video && !isRegularURL(op.insert.video)) {
          const file = await fetchFile(op.insert.video);
          const url = await uploadToCloudinary(file);
          accDelta.push({ insert: { video: url } });

          //
        } else {
          accDelta.push(op);
        }
      } else {
        accDelta.push(op);
      }
      //
      return accDelta;
    }, Promise.resolve([]));

    const updatedValue = await newDelta;
    setValue(new Delta(updatedValue));
  };

  useEffect(() => {
    console.log("current value", value);
  }, [value]);

  return (
    <div style={{ position: "relative" }}>
      {isLoading && <Loading />}
      <Toolbar />

      <Box my={3}>
        <ul>
          {hashtags.map((hashtag, index) => (
            <li key={index}>{hashtag}</li>
          ))}
        </ul>
      </Box>

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        readOnly={isLoading}
      />

      <Box display="flex" gap={4} justifyContent="flex-end" my={3}>
        <Button
          disabled={isLoading}
          color="error"
          variant="outlined"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>

      <Box my={3}>
        <h3>Preview:</h3>
        <div dangerouslySetInnerHTML={{ __html: htmlPreview }} />
      </Box>
    </div>
  );
}
