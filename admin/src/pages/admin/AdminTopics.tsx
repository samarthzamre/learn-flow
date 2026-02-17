import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  MoreHorizontal,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTopics, deleteTopic } from "@/lib/api";

const AdminTopics = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const queryClient = useQueryClient();

  const { data: topics = [], isLoading } = useQuery({
    queryKey: ["admin-topics", selectedStatus, searchQuery],
    queryFn: () => getTopics({ status: selectedStatus !== "All" ? selectedStatus : undefined, search: searchQuery || undefined }),
  });

  const deleteM = useMutation({
    mutationFn: (id: number) => deleteTopic(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-topics"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });

  const handleDelete = (id: number, title: string) => {
    deleteM.mutate(id, {
      onSuccess: () => toast.success(`"${title}" deleted successfully`),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">Manage Topics</h1>
            <p className="text-muted-foreground text-sm">
              Create, edit and manage all your learning topics
            </p>
          </div>
          <Link to="/admin/topics/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Topic
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {["All", "Published", "Draft"].map((status) => (
                  <Button
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus(status)}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Topics List */}
            <div className="space-y-3">
              {topics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {/* Determine border color based on category name/slug */}
                  {(() => {
                    let borderClass = "border-t-primary";
                    const cat = topic.categorySlug?.toLowerCase() || topic.categoryName?.toLowerCase() || "";
                    if (cat.includes("ai")) borderClass = "border-t-purple-500";
                    else if (cat.includes("programming") || cat.includes("code")) borderClass = "border-t-blue-500";
                    else if (cat.includes("science")) borderClass = "border-t-pink-500";
                    else if (cat.includes("business") || cat.includes("finance")) borderClass = "border-t-orange-500";
                    else if (cat.includes("lifestyle") || cat.includes("health")) borderClass = "border-t-emerald-500";

                    return (
                      <Card className={`hover:border-primary/30 transition-colors border-t-[6px] ${borderClass}`}>
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            {/* Topic Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium truncate text-lg">{topic.title}</h3>
                                <Badge
                                  variant={topic.status === "Published" ? "default" : "secondary"}
                                  className={topic.status === "Published" ? "bg-emerald-500/10 text-emerald-600 border-0" : ""}
                                >
                                  {topic.status}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                <span className={borderClass.replace("border-t-", "text-").replace("-500", "-600") + " font-semibold uppercase text-xs"}>
                                  {topic.categoryName}
                                </span>
                                <span>•</span>
                                <span>{topic.difficulty}</span>
                                <span>•</span>
                                <span>{topic.views} views</span>
                              </div>
                            </div>

                            {/* Content Types */}
                            <div className="flex items-center gap-2">
                              {topic.has_infographic && (
                                <Badge variant="outline" className="text-xs">Infographic</Badge>
                              )}
                              {topic.has_article && (
                                <Badge variant="outline" className="text-xs">Article</Badge>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <Link to={`/admin/topics/${topic.id}/edit`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                              </Link>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleDelete(topic.id, topic.title)}>
                                    <Trash2 className="w-4 h-4 mr-2 text-destructive" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })()}
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {topics.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">No topics found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
                <Button onClick={() => { setSearchQuery(""); setSelectedStatus("All"); }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default AdminTopics;
