"use client";
// InitializedMDXEditor.tsx
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  toolbarPlugin,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  UndoRedo,
  BoldItalicUnderlineToggles,
  ListsToggle,
  Separator,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  codeBlockPlugin,
  tablePlugin,
  imagePlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  linkDialogPlugin,
  linkPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { basicDark } from "cm6-theme-basic-dark";
import "./dark-editor.css";
import { useTheme } from "next-themes";
import React, { ForwardedRef } from "react";

interface EditorProps {
  editorRef: ForwardedRef<MDXEditorMethods> | null;
  value: string;
  fieldChange: (value: string) => void;
}

const Editor = ({ value, fieldChange, editorRef, ...props }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? [basicDark] : [];

  return (
    <MDXEditor
      key={resolvedTheme}
      markdown={value}
      className="background-light800_dark200 light-border-2 markdown-editor dark-editor grid w-full border"
      onChange={fieldChange}
      ref={editorRef}
      plugins={[
        // Example Plugin Usage
        headingsPlugin(),
        linkPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
        tablePlugin(),
        imagePlugin(),
        listsPlugin(),
        quotePlugin(),
        codeMirrorPlugin({
          codeBlockLanguages: {
            css: "css",
            js: "Javascript",
            jsx: "Javascript (React)",
            ts: "Typescript",
            tsx: "Typescript (React)",
            txt: "txt",
            sql: "sql",
            html: "html",
            saas: "saas",
            scss: "scss",
            json: "json",
            "": "unspecified",
            bash: "bash",
          },
          autoLoadLanguageSupport: true,
          codeMirrorExtensions: theme,
        }),
        diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),
        thematicBreakPlugin(),
        linkDialogPlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <ConditionalContents
              options={[
                {
                  when: (editor) => editor?.editorType === "codeblock",
                  contents: () => <ChangeCodeMirrorLanguage />,
                },
                {
                  fallback: () => (
                    <>
                      <UndoRedo />
                      <Separator />

                      <BoldItalicUnderlineToggles />
                      <Separator />

                      <ListsToggle />
                      <Separator />

                      <CreateLink />
                      <InsertImage />
                      <Separator />

                      <InsertTable />
                      <InsertThematicBreak />

                      <InsertCodeBlock />
                    </>
                  ),
                },
              ]}
            />
          ),
        }),
      ]}
      {...props}
    />
  );
};

export default Editor;
