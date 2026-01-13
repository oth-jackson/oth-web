"use client";

import { useEffect, useState } from "react";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { Checkbox } from "@/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import type { PostItem } from "../data/posts";

interface PostSettingsProps {
  post: PostItem | Omit<PostItem, "id">;
  onChange: (postSettings: Partial<PostItem>) => void;
  errors?: Record<string, string[] | undefined>;
}

export default function PostSettings({
  post,
  onChange,
  errors,
}: PostSettingsProps) {
  // Local state for tags input
  const [tagsInput, setTagsInput] = useState(() => {
    return post.tags && Array.isArray(post.tags) ? post.tags.join(", ") : "";
  });

  // Update tags array whenever tagsInput changes
  useEffect(() => {
    // Parse tags from the input string
    const tagsArray = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    console.log("Parsed tags:", tagsArray);

    // Only update if tags have changed to avoid infinite loops
    const currentTags = post.tags || [];
    const tagsChanged =
      tagsArray.length !== currentTags.length ||
      tagsArray.some((tag, i) => tag !== currentTags[i]);

    if (tagsChanged) {
      onChange({ tags: tagsArray });
    }
  }, [tagsInput, post.tags, onChange]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      onChange({ [name]: e.target.checked });
    } else {
      onChange({ [name]: value });
    }
  };

  // Special handler for Select component
  const handleSelectChange = (name: string, value: string) => {
    onChange({ [name]: value });
  };

  // Handler for tags input that only updates local state
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
  };

  return (
    <div className="space-y-5">
      {/* Core Metadata */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="space-y-2 w-full md:w-[45%]">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            value={post.title}
            onChange={handleChange}
            required
            placeholder="Enter post title"
          />
          {errors?.title && (
            <p className="text-sm text-red-600 mt-1">{errors.title[0]}</p>
          )}
          {errors?.slug && (
            <p className="text-sm text-red-600 mt-1">
              Slug error: {errors.slug[0]}
            </p>
          )}
        </div>

        <div className="space-y-2 w-full md:w-[35%]">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            name="author"
            value={post.author || ""}
            onChange={handleChange}
            placeholder="Author name"
          />
        </div>

        <div className="w-full md:w-[20%] flex justify-start">
          <div className="flex items-center space-x-2 md:mt-6">
            <Checkbox
              id="featured"
              name="featured"
              checked={post.featured || false}
              onCheckedChange={(checked: boolean | "indeterminate") =>
                onChange({ featured: Boolean(checked) })
              }
            />
            <Label htmlFor="featured" className="font-medium">
              Featured
            </Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={post.description || ""}
          onChange={handleChange}
          className="h-20"
          placeholder="A brief description of your post"
        />
      </div>

      {/* Image URL, Type, and Tags in one row */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="space-y-2 w-full md:w-auto">
          <Label htmlFor="contentType">Type *</Label>
          <Select
            name="contentType"
            value={post.contentType}
            onValueChange={(value) => handleSelectChange("contentType", value)}
            required
          >
            <SelectTrigger id="contentType" className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blog">Blog</SelectItem>
              <SelectItem value="project">Project</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 w-full md:flex-[1.5]">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            name="tags"
            value={tagsInput}
            onChange={handleTagsChange}
            placeholder="tag1, tag2, tag3"
          />
        </div>
      </div>

      {/* Hidden date fields with automatic values */}
      <input
        type="hidden"
        id="date"
        name="date"
        value={post.date || new Date().toISOString().split("T")[0]}
        onChange={() => {}}
      />
    </div>
  );
}
