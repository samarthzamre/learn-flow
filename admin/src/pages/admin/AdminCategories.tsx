import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  GripVertical,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { toast } from "sonner";

const initialCategories = [
  { id: "1", name: "AI & ML", slug: "ai-ml", topicCount: 24, visible: true, color: "#8B5CF6" },
  { id: "2", name: "Programming", slug: "programming", topicCount: 38, visible: true, color: "#3B82F6" },
  { id: "3", name: "Tech", slug: "tech", topicCount: 22, visible: true, color: "#06B6D4" },
  { id: "4", name: "Business", slug: "business", topicCount: 18, visible: true, color: "#F59E0B" },
  { id: "5", name: "Finance", slug: "finance", topicCount: 15, visible: true, color: "#10B981" },
  { id: "6", name: "Science", slug: "science", topicCount: 12, visible: false, color: "#F43F5E" },
];

const AdminCategories = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const newCategory = {
      id: Date.now().toString(),
      name: newCategoryName,
      slug: newCategoryName.toLowerCase().replace(/\s+/g, "-"),
      topicCount: 0,
      visible: true,
      color: "#6366F1",
    };
    
    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    toast.success(`Category "${newCategoryName}" created`);
  };

  const handleToggleVisibility = (id: string) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, visible: !cat.visible } : cat
    ));
  };

  const handleDelete = (id: string, name: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
    toast.success(`Category "${name}" deleted`);
  };

  const handleStartEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const handleSaveEdit = (id: string) => {
    setCategories(categories.map(cat =>
      cat.id === id ? { ...cat, name: editName, slug: editName.toLowerCase().replace(/\s+/g, "-") } : cat
    ));
    setEditingId(null);
    toast.success("Category updated");
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">Categories</h1>
          <p className="text-muted-foreground text-sm">
            Organize your topics with categories
          </p>
        </div>

        {/* Add Category */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Input
                placeholder="New category name..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                className="flex-1"
              />
              <Button onClick={handleAddCategory} className="gap-2 shrink-0">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Category</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Categories List */}
        <div className="space-y-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className={`transition-opacity ${!category.visible ? "opacity-60" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Drag Handle */}
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab hidden sm:block" />
                    
                    {/* Color Indicator */}
                    <div 
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: category.color }}
                    />

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      {editingId === category.id ? (
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(category.id)}
                          onBlur={() => handleSaveEdit(category.id)}
                          autoFocus
                          className="h-8"
                        />
                      ) : (
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-xs text-muted-foreground">{category.topicCount} topics</p>
                        </div>
                      )}
                    </div>

                    {/* Visibility Toggle */}
                    <div className="flex items-center gap-2">
                      {category.visible ? (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      )}
                      <Switch
                        checked={category.visible}
                        onCheckedChange={() => handleToggleVisibility(category.id)}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleStartEdit(category.id, category.name)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(category.id, category.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminCategories;
