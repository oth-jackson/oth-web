"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import {
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { getPostList, deletePost, updatePost } from "../actions";
import type { PostItem } from "../data/posts";
import { Switch } from "@/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Input } from "@/ui/input";

// Inline ConfirmationModal - works perfectly here
function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  isLoading: boolean;
}) {
  const [inputText, setInputText] = useState("");
  const [showError, setShowError] = useState(false);
  const isValid = inputText.toLowerCase().trim() === "delete";

  const handleConfirm = () => {
    if (!isValid) {
      setShowError(true);
      return;
    }
    onConfirm();
  };

  const handleInputChange = (value: string) => {
    setInputText(value);
    if (showError && value.toLowerCase().trim() === "delete") {
      setShowError(false);
    }
  };

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setInputText("");
      setShowError(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={!isLoading ? onClose : undefined}>
      <DialogContent className="sm:max-w-md border-2 border-black bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md bg-destructive/10 p-3 border border-destructive/20">
            <p className="text-sm text-destructive font-medium">
              To confirm deletion, type &ldquo;
              <span className="font-mono">delete</span>&rdquo; below:
            </p>
          </div>

          <div className="space-y-2">
            <Input
              value={inputText}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Type 'delete' to confirm"
              disabled={isLoading}
              className={
                showError
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
              autoComplete="off"
              spellCheck={false}
            />
            {showError && (
              <p className="text-sm text-destructive">
                Please type &ldquo;delete&rdquo; exactly to confirm deletion.
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isValid || isLoading}
          >
            {isLoading ? "Deleting..." : "Delete post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function PostsTable() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    postId: number | null;
    postTitle: string;
    isDeleting: boolean;
  }>({
    isOpen: false,
    postId: null,
    postTitle: "",
    isDeleting: false,
  });

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPostList();
        const formattedData = data.map((item) => ({
          ...item,
          id: Number(item.id),
        }));
        setPosts(formattedData);
      } catch (err) {
        console.error("Failed to load posts:", err);
        setError("Failed to load posts. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    loadPosts();
  }, []);

  const handleFeaturedToggle = async (id: number, currentFeatured: boolean) => {
    const newFeaturedStatus = !currentFeatured;
    try {
      const result = await updatePost(id, { featured: newFeaturedStatus });

      if (result.success) {
        setPosts((currentPosts) =>
          currentPosts.map((item) =>
            item.id === id ? { ...item, featured: newFeaturedStatus } : item
          )
        );
      } else {
        console.error("Failed to update featured status:", result.error);
        alert(`Failed to update featured status: ${result.error}`);
      }
    } catch (err) {
      console.error("Error during featured status update:", err);
      alert("An unexpected error occurred while updating the featured status.");
    }
  };

  const handleStatusUpdate = async (
    id: number,
    newStatus: "draft" | "published"
  ) => {
    try {
      const publishDate =
        newStatus === "published"
          ? new Date().toISOString().split("T")[0]
          : null;
      const updateData = {
        status: newStatus,
        publishDate: publishDate,
      };

      const result = await updatePost(id, updateData);

      if (result.success) {
        setPosts((currentPosts) =>
          currentPosts.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: newStatus,
                  publishDate: publishDate,
                }
              : item
          )
        );
      } else {
        console.error("Failed to update post status:", result.error);
        alert(`Failed to update status: ${result.error}`);
      }
    } catch (err) {
      console.error("Error during post status update:", err);
      alert("An unexpected error occurred while updating the status.");
    }
  };

  const handleDeleteClick = (id: number, title: string) => {
    setDeleteModal({
      isOpen: true,
      postId: id,
      postTitle: title,
      isDeleting: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.postId) return;

    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

    try {
      const result = await deletePost(deleteModal.postId);
      if (result.success) {
        setPosts((currentPosts) =>
          currentPosts.filter((item) => item.id !== deleteModal.postId)
        );
        setDeleteModal({
          isOpen: false,
          postId: null,
          postTitle: "",
          isDeleting: false,
        });
      } else {
        console.error("Failed to delete post:", result.error);
        alert(`Failed to delete post: ${result.error}`);
        setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
      }
    } catch (err) {
      console.error("Error during post deletion:", err);
      alert("An unexpected error occurred while deleting the post.");
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const handleDeleteCancel = () => {
    if (!deleteModal.isDeleting) {
      setDeleteModal({
        isOpen: false,
        postId: null,
        postTitle: "",
        isDeleting: false,
      });
    }
  };

  return (
    <div className="rounded-md border">
      {isLoading && <div className="text-center py-10">Loading posts...</div>}
      {error && (
        <div className="text-center py-10 text-destructive">{error}</div>
      )}

      {!isLoading && !error && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Featured</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  No posts found.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <span
                      className={`capitalize px-2 py-1 rounded-full text-xs ${
                        item.contentType === "blog"
                          ? "bg-blue-100 text-blue-800"
                          : item.contentType === "project"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {item.contentType}
                    </span>
                  </TableCell>
                  <TableCell>{item.publishDate || item.date}</TableCell>
                  <TableCell className="w-[100px]">
                    <div className="flex items-center justify-center">
                      <Switch
                        id={`featured-${item.id}`}
                        checked={item.featured ?? false}
                        onCheckedChange={() =>
                          handleFeaturedToggle(item.id, item.featured ?? false)
                        }
                        aria-label={
                          item.featured
                            ? "Unmark as featured"
                            : "Mark as featured"
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell className="w-[120px]">
                    <span
                      className={`capitalize px-2 py-1 rounded-full text-xs ${
                        item.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {item.status === "published" && (
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/posts/${item.contentType}/${item.slug}`}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                          <Link href={`/publish/${item.id}`}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(item.id, item.title)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                        {item.status === "draft" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(item.id, "published")
                            }
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Publish
                          </DropdownMenuItem>
                        )}
                        {item.status === "published" && (
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(item.id, "draft")}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete post"
        description={
          <>
            This action cannot be undone. This will permanently delete the post{" "}
            <strong>&ldquo;{deleteModal.postTitle}&rdquo;</strong> and remove
            all associated data.
          </>
        }
        isLoading={deleteModal.isDeleting}
      />
    </div>
  );
}
