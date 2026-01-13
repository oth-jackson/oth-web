"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ImagePlus, ImageUp, X, Settings } from "lucide-react";
import { apiMediaLoader } from "@/lib/next/image-loader";
import { Button } from "@/ui/button";
import { Textarea } from "@/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";
import { createPost, updatePost } from "../actions";
import type { PostItem } from "../data/posts";
import PostSettingsForm from "./PostSettings";

interface ImageUploadSuccessResponse {
  success: true;
  imageUrl: string;
}

interface ImageUploadErrorResponse {
  success: false;
  error: string;
}

type ImageUploadResponse =
  | ImageUploadSuccessResponse
  | ImageUploadErrorResponse;

interface MarkdownEditorProps {
  initialPost: PostItem | Omit<PostItem, "id">;
  isNew: boolean;
}

const PlaceholderStyles = `
  [data-empty="true"]::before {
    content: attr(data-placeholder);
    position: absolute;
    color: var(--muted-foreground);
    opacity: 0.6;
    pointer-events: none;
  }
`;

export default function MarkdownEditor({
  initialPost,
  isNew,
}: MarkdownEditorProps) {
  const [post, setPost] = useState<PostItem | Omit<PostItem, "id">>(() => {
    const imageValue =
      initialPost.image === "/placeholder.jpg" ? "" : initialPost.image;
    return {
      ...initialPost,
      image: imageValue,
      contentType: initialPost.contentType || "blog",
    };
  });

  const [activeTab, setActiveTab] = useState("editor");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>(
    {}
  );
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [postDataModalOpen, setPostDataModalOpen] = useState(false);
  const [scrollPositions, setScrollPositions] = useState<
    Record<string, number>
  >({
    editor: 0,
    preview: 0,
  });

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const featuredImageUploadRef = useRef<HTMLInputElement>(null);
  const editorScrollRef = useRef<HTMLDivElement>(null);
  const previewScrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Auto-resize content textarea height
  useEffect(() => {
    if (activeTab !== "editor" || !contentRef.current) return;
    const textarea = contentRef.current;
    const adjustHeight = () => {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.max(textarea.scrollHeight, 500)}px`;
    };
    setTimeout(adjustHeight, 0);
    const resizeObserver = new ResizeObserver(adjustHeight);
    resizeObserver.observe(textarea);
    return () => resizeObserver.disconnect();
  }, [post.content, activeTab]);

  // Set initial title content and update when title changes
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.textContent = post.title;
      if (post.title && post.title.trim()) {
        titleRef.current.setAttribute("data-empty", "false");
      } else {
        titleRef.current.textContent = "";
        titleRef.current.setAttribute("data-empty", "true");
      }
    }
    // This effect is intended to run once on mount to set the initial DOM state
    // based on the initial React state. The `onInput` handler will manage
    // subsequent updates to the DOM and React state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPost({ ...post, content: e.target.value });
  };

  const handleCancel = () => {
    router.push("/content");
  };

  const handlePostDataChange = (postData: Partial<PostItem>) => {
    setPost({ ...post, ...postData });
  };

  const handleContinueToPostData = () => {
    if (!post.content?.trim()) {
      setGeneralError("Please add some content before continuing.");
      return;
    }

    if (!post.title?.trim()) {
      setGeneralError("Please add a title before continuing.");
      return;
    }

    setGeneralError(null);
    setPostDataModalOpen(true);
  };

  const handleSave = async (publishStatus: "draft" | "published" = "draft") => {
    setIsSaving(true);
    setErrors({});
    setGeneralError(null);

    try {
      if (!post.contentType) {
        setErrors({ contentType: ["Content type is required."] });
        setGeneralError("Please select a content type.");
        setIsSaving(false);
        return;
      }

      const currentDate = new Date().toISOString().split("T")[0];
      const postToSave = {
        ...post,
        status: publishStatus,
        date: post.date || currentDate,
        publishDate: publishStatus === "published" ? currentDate : null,
      };

      if (isNew) {
        const validPostData = {
          title: postToSave.title,
          slug: postToSave.slug,
          contentType: postToSave.contentType as "blog" | "project",
          content: postToSave.content,
          date: postToSave.date,
          description: postToSave.description || null,
          author: postToSave.author || null,
          tags: Array.isArray(postToSave.tags) ? postToSave.tags : [],
          image: postToSave.image || null,
          featured: Boolean(postToSave.featured),
          status: postToSave.status as "draft" | "published",
          publishDate: postToSave.publishDate || null,
        };

        const result = await createPost(validPostData);
        if (result.success) {
          router.push("/content");
          router.refresh();
        } else {
          setErrors(result.issues || {});
          setGeneralError(result.error || "Failed to create post.");
        }
      } else {
        if (!("id" in postToSave)) {
          setGeneralError("Cannot update post without an ID.");
          throw new Error("Cannot update post without an ID.");
        }
        const result = await updatePost(postToSave.id, postToSave);
        if (result.success) {
          router.push("/content");
          router.refresh();
        } else {
          setErrors(result.issues || {});
          setGeneralError(result.error || "Failed to update post.");
        }
      }
    } catch (error) {
      console.error("Error saving post:", error);
      const message = error instanceof Error ? error.message : String(error);
      setGeneralError(`An unexpected error occurred: ${message}`);
    } finally {
      setIsSaving(false);
      setPostDataModalOpen(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    isFeatured: boolean = false
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = "";
    setGeneralError(null);
    setIsUploadingImage(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as ImageUploadResponse;

      if (!result.success) {
        throw new Error(result.error || "Image upload failed");
      }

      if (isFeatured) {
        setPost({ ...post, image: result.imageUrl });
      } else {
        const markdownToInsert = `![](${result.imageUrl})`;
        const textarea = contentRef.current;
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const currentContent = post.content || "";
          const newContent =
            currentContent.substring(0, start) +
            markdownToInsert +
            currentContent.substring(end);
          setPost({ ...post, content: newContent });
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(
              start + markdownToInsert.length,
              start + markdownToInsert.length
            );
          }, 0);
        }
      }
    } catch (error) {
      console.error("Image upload error:", error);
      const message = error instanceof Error ? error.message : String(error);
      setGeneralError(`Image upload failed: ${message}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleTabChange = (newTab: string) => {
    if (activeTab === "editor" && editorScrollRef.current) {
      setScrollPositions((prev) => ({
        ...prev,
        editor: editorScrollRef.current!.scrollTop,
      }));
    } else if (activeTab === "preview" && previewScrollRef.current) {
      setScrollPositions((prev) => ({
        ...prev,
        preview: previewScrollRef.current!.scrollTop,
      }));
    }
    setActiveTab(newTab);
  };

  useEffect(() => {
    if (activeTab === "editor" && editorScrollRef.current) {
      editorScrollRef.current.scrollTop = scrollPositions.editor;
    } else if (activeTab === "preview" && previewScrollRef.current) {
      previewScrollRef.current.scrollTop = scrollPositions.preview;
    }
  }, [activeTab, scrollPositions]);

  const pageHeaderSection = (
    <div className="w-full px-4 md:px-6 pt-2 bg-transparent dark:bg-transparent">
      {post.image ? (
        <div className="mb-6 w-full">
          <div className="relative group w-full">
            <Image
              src={post.image}
              alt="Featured image"
              loader={apiMediaLoader}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto", maxHeight: "24rem" }}
              className="rounded-md object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setPost({ ...post, image: "" })}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove featured image</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="mb-4 flex justify-start">
          <Button
            variant="link"
            onClick={() => featuredImageUploadRef.current?.click()}
            disabled={isUploadingImage}
            className="w-auto text-muted-foreground hover:text-foreground px-0 py-0 h-auto opacity-70 hover:opacity-100 hover:no-underline focus-visible:ring-0 focus-visible:ring-offset-0 transition-opacity duration-150 align-middle -ml-3 sm:-ml-3"
          >
            <ImageUp className="h-5 w-5 mr-1" />
            <span>{isUploadingImage ? "Uploading..." : "Feature Image"}</span>
          </Button>
        </div>
      )}
      <div className="mb-2">
        <style dangerouslySetInnerHTML={{ __html: PlaceholderStyles }} />
        <div
          ref={titleRef}
          contentEditable
          role="textbox"
          aria-multiline="true"
          spellCheck="true"
          onInput={(e) => {
            const text = e.currentTarget.textContent || "";
            setPost({ ...post, title: text });

            // Handle empty state for placeholder
            if (!text.trim()) {
              e.currentTarget.setAttribute("data-empty", "true");
            } else {
              e.currentTarget.setAttribute("data-empty", "false");
            }
          }}
          onBlur={(e) => {
            const text = e.currentTarget.textContent || "";
            if (!text.trim()) {
              e.currentTarget.setAttribute("data-empty", "true");
            }
          }}
          data-placeholder="Enter title..."
          data-empty="true"
          className="w-full min-h-[40px] text-2xl sm:text-3xl lg:text-4xl font-bold border-0 outline-none shadow-none bg-transparent dark:bg-transparent focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 leading-tight sm:leading-snug px-0 py-1 whitespace-normal break-words relative"
          suppressContentEditableWarning
        />
      </div>
    </div>
  );

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full bg-transparent"
    >
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={imageUploadRef}
        onChange={(e) => handleImageUpload(e, false)}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={featuredImageUploadRef}
        onChange={(e) => handleImageUpload(e, true)}
        accept="image/*"
        className="hidden"
      />

      {/* Sticky Header */}
      <div className="sticky top-[65px] z-20 bg-background py-1 sm:py-3 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto order-first sm:order-none">
            <TabsList className="grid grid-cols-2 flex-1 sm:w-52 bg-secondary dark:bg-muted">
              <TabsTrigger
                value="editor"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Markdown
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Preview
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => imageUploadRef.current?.click()}
                disabled={isUploadingImage}
                title="Add Image to Content"
              >
                <ImagePlus className="size-auto h-5 w-5" />
                <span className="sr-only">Add Image to Content</span>
              </Button>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 w-full sm:w-auto order-last sm:ml-auto">
            {generalError && !postDataModalOpen && (
              <p className="text-sm text-red-600 mr-2">{generalError}</p>
            )}
            <Button
              variant="outline"
              onClick={handleCancel}
              size="sm"
              className="flex-1 sm:flex-initial"
            >
              Cancel
            </Button>
            <Button
              onClick={handleContinueToPostData}
              size="sm"
              className="flex-1 sm:flex-initial"
              disabled={isSaving}
            >
              <Settings className="h-4 w-4 sm:hidden md:inline-block" />
              {isNew ? "Continue" : "Update"}
            </Button>
          </div>
        </div>
      </div>

      {/* Page Header (Featured Image + Title) */}
      {pageHeaderSection}

      {/* Tabs Content Area */}
      <TabsContent
        value="editor"
        className="p-0 border-none pb-24 sm:pb-4 bg-transparent dark:bg-transparent"
      >
        <div
          ref={editorScrollRef}
          className="overflow-auto min-h-[calc(100vh-220px)] px-4 md:px-6 bg-transparent dark:bg-transparent"
        >
          <Textarea
            ref={contentRef}
            value={post.content || ""}
            onChange={handleContentChange}
            placeholder="Start writing your Markdown content here..."
            className="font-mono w-full border-0 outline-none shadow-none bg-transparent dark:bg-transparent text-sm placeholder:text-muted-foreground resize-none p-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 overflow-hidden"
            style={{ minHeight: "500px" }}
          />
          {errors?.content && (
            <p className="text-sm text-red-600 mt-1">{errors.content[0]}</p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="preview" className="p-0 border-none pb-24 sm:pb-4">
        <div
          ref={previewScrollRef}
          className="prose dark:prose-invert max-w-none min-h-[calc(100vh-220px)] overflow-auto bg-background border-0 px-4 md:px-6"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code(props) {
                const { children, className, node } = props;
                const match = /language-(\w+)/.exec(className || "");
                const inline =
                  node?.type === "element" &&
                  node?.tagName === "code" &&
                  typeof children === "string" &&
                  !children.includes("\n");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={coldarkDark}
                    language={match[1]}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className}>{children}</code>
                );
              },
              img({ src, alt }) {
                if (!src) return null;
                return (
                  <Image
                    src={src as string}
                    alt={alt || ""}
                    loader={apiMediaLoader}
                    width={600}
                    height={400}
                    className="rounded-md max-w-full h-auto"
                    style={{
                      width: "100%",
                      maxHeight: "500px",
                      objectFit: "contain",
                    }}
                  />
                );
              },
            }}
          >
            {post.content || "Start writing your Markdown content here..."}
          </ReactMarkdown>
        </div>
      </TabsContent>

      {/* Dialog for Post Data (Settings) */}
      <Dialog open={postDataModalOpen} onOpenChange={setPostDataModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto w-[95vw] max-w-md sm:max-w-lg md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isNew ? "Complete Post" : "Edit Post"}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <PostSettingsForm
              post={post}
              onChange={handlePostDataChange}
              errors={errors}
            />
          </div>
          <div className="mt-2">
            {generalError && (
              <p className="text-sm text-red-600 mb-4">{generalError}</p>
            )}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPostDataModalOpen(false)}
                disabled={isSaving}
                className="w-full sm:w-auto sm:mr-auto order-2 sm:order-1"
              >
                Back
              </Button>
              <div className="flex w-full sm:w-auto justify-end space-x-3 order-1 sm:order-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleSave("draft")}
                  disabled={isSaving}
                  className="flex-1 sm:flex-initial"
                >
                  {isSaving ? "Saving Draft..." : "Save"}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSave("published")}
                  disabled={isSaving}
                  className="flex-1 sm:flex-initial"
                >
                  {isSaving ? "Publishing..." : "Publish"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile Footer for Actions (Old Style) */}
      <div className="block sm:hidden fixed bottom-0 left-0 right-0 bg-background p-3 shadow-md z-30 border-t">
        <div className="flex items-center gap-3 w-full">
          {generalError && !postDataModalOpen && (
            <p
              className="text-xs text-red-600 truncate flex-shrink mr-2"
              title={generalError}
            >
              {generalError}
            </p>
          )}
          <Button
            variant="outline"
            onClick={handleCancel}
            size="sm"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleContinueToPostData}
            size="sm"
            className="flex-1"
            disabled={isSaving}
          >
            {isNew ? "Continue" : "Edit Settings"}
          </Button>
        </div>
      </div>
    </Tabs>
  );
}
