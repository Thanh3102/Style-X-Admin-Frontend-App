"use client";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  Autoformat,
  WordCount,
  Indent,
  IndentBlock,
  ClassicEditor,
  Base64UploadAdapter,
  Bold,
  Italic,
  Code,
  CodeBlock,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
  Essentials,
  Mention,
  Paragraph,
  Undo,
  Image,
  ImageUpload,
  ImageInsert,
  ImageInsertViaUrl,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageBlock,
  ImageInline,
  ImageTextAlternative,
  LinkImage,
  Alignment,
  BlockQuote,
  Heading,
  Font,
  GeneralHtmlSupport,
  List,
  ListProperties,
  MediaEmbed,
  RemoveFormat,
  EventInfo,
  Table,
  TableToolbar,
  TableCellProperties,
  TableProperties,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";
import RenderIf from "../ui/RenderIf";
import { useRef } from "react";

type Props = {
  label?: string;
  placeholder?: string;
  // maxLength?: number;
  isDisabled?: boolean;
  defaultValue?: string;
  onValueChange?: (data: string) => void;
};

const EditorPlugins = [
  Autoformat,
  Indent,
  IndentBlock,
  WordCount,
  Bold,
  Essentials,
  Italic,
  Mention,
  Paragraph,
  Code,
  CodeBlock,
  Undo,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  ImageInsert,
  ImageInsertViaUrl,
  ImageTextAlternative,
  ImageBlock,
  ImageInline,
  LinkImage,
  Alignment,
  BlockQuote,
  Base64UploadAdapter,
  Heading,
  Font,
  GeneralHtmlSupport,
  List,
  ListProperties,
  MediaEmbed,
  RemoveFormat,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
  Table,
  TableToolbar,
  TableCellProperties,
  TableProperties,
];

const EditorToolbar = [
  // "undo",
  // "redo",
  "code",
  // "|",
  "heading",
  "|",
  //   "fontfamily",
  "fontsize",
  "bold",
  "italic",
  "underline",
  "fontColor",
  // "fontBackgroundColor",
  // "|",
  // "strikethrough",
  // "subscript",
  // "superscript",
  "|",
  "alignment",
  "|",
  "link",
  "insertImage",
  "mediaEmbed",
  "blockQuote",
  //   "codeBlock",
  "|",
  "bulletedList",
  "numberedList",
  "outdent",
  "indent",
  "insertTable",
  "|",
  "removeFormat",
];

const EditorImageToolbar = [
  "toggleImageCaption",
  "linkImage",
  "imageTextAlternative",
  "|",
  "imageStyle:block",
  "imageStyle:inline",
  "imageStyle:side",
  "|",
  "imageStyle:alignLeft",
  "imageStyle:alignCenter",
  "imageStyle:alignRight",
  "|",
  "imageStyle:alignBlockLeft",
  "imageStyle:alignBlockRight",
];

const EditorTableToolbar = [
  "tableColumn",
  "tableRow",
  "mergeTableCells",
  "tableProperties",
  "tableCellProperties",
];

const TextEditor = (props: Props) => {
  const {
    label,
    placeholder,
    isDisabled,
    // maxLength = 50000,
    defaultValue,
    onValueChange,
  } = props;
  // const [characterCount, setCharacterCount] = useState(0);

  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleValueChange = (event: EventInfo, editor: ClassicEditor) => {
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const data = editor.getData();
      onValueChange && onValueChange(data);
      // setCharacterCount(data.length);
    }, 400);
  };

  // const handleWordCountUpdate = (stats: {
  //   words: number;
  //   characters: number;
  // }) => {
  //   setCharacterCount(stats.characters);
  // };

  return (
    <div className="flex flex-col gap-1 max-w-full">
      <RenderIf condition={!!label}>
        <h4 className="label">{label}</h4>
      </RenderIf>
      <CKEditor
        editor={ClassicEditor}
        config={{
          toolbar: {
            items: EditorToolbar,
            shouldNotGroupWhenFull: false,
          },
          plugins: EditorPlugins,
          placeholder: placeholder,
          image: {
            toolbar: EditorImageToolbar,
          },
          table: {
            contentToolbar: EditorTableToolbar,
          },
          list: {
            properties: {
              styles: true,
              startIndex: true,
              reversed: true,
            },
          },
          initialData: defaultValue,
          ui: {
            poweredBy: {
              position: "inside",
              side: "right",
              label: "",
              horizontalOffset: 1,
              verticalOffset: 1,
              forceVisible: false,
            },
          },
          // wordCount: {
          //   onUpdate: handleWordCountUpdate,
          // },
        }}
        onChange={handleValueChange}
        disabled={isDisabled}
      />
      {/* <div className="p-1 flex gap-2 justify-end items-center">
        <span>{`HTML: ${characterCount}/${maxLength}`}</span>
        <InfoTooltip
          content={
            <span>
              Số lượng ký tự có trong đoạn văn bản.
              <br />
              Lưu ý: Số lượng ký tự có thể khác số lượng từ
            </span>
          }
        />
      </div> */}
    </div>
  );
};
export default TextEditor;
