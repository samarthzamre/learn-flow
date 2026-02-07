import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye,
  MoreHorizontal,
  Filter
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

const topics = [
  { id: "1", title: "Large Language Models", category: "AI & ML", difficulty: "Intermediate", status: "Published", views: "2.4K", hasInfographic: true, hasArticle: true },
  { id: "2", title: "React Server Components", category: "Programming", difficulty: "Advanced", status: "Published", views: "1.8K", hasInfographic: true, hasArticle: true },
  { id: "3", title: "Quantum Computing Basics", category: "Science", difficulty: "Beginner", status: "Draft", views: "1.2K", hasInfographic: true, hasArticle: false },
  { id: "4", title: "Startup Fundraising", category: "Business", difficulty: "Intermediate", status: "Published", views: "980", hasInfographic: true, hasArticle: true },
  { id: "5", title: "Neural Networks Deep Dive", category: "AI & ML", difficulty: "Advanced", status: "Published", views: "856", hasInfographic: true, hasArticle: true },
  { id: "6", title: "TypeScript Best Practices", category: "Programming", difficulty: "Intermediate", status: "Draft", views: "654", hasInfographic: false, hasArticle: true },
];

const AdminTopics = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "All" || topic.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string, title: string) => {
    toast.success(`"${title}" deleted successfully`);
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

        {/* Topics List */}
        <div className="space-y-3">
          {filteredTopics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Topic Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{topic.title}</h3>
                        <Badge
                          variant={topic.status === "Published" ? "default" : "secondary"}
                          className={topic.status === "Published" ? "bg-emerald-500/10 text-emerald-600 border-0" : ""}
                        >
                          {topic.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span>{topic.category}</span>
                        <span>•</span>
                        <span>{topic.difficulty}</span>
                        <span>•</span>
                        <span>{topic.views} views</span>
                      </div>
                    </div>

                    {/* Content Types */}
                    <div className="flex items-center gap-2">
                      {topic.hasInfographic && (
                        <Badge variant="outline" className="text-xs">Infographic</Badge>
                      )}
                      {topic.hasArticle && (
                        <Badge variant="outline" className="text-xs">Article</Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link to={`/topic/${topic.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
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
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTopics.length === 0 && (
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
      </motion.div>
    </AdminLayout>
  );
};

export default AdminTopics;
