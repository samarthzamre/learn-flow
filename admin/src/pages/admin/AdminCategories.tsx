import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Upload,
  Cpu, Code, Brain, Briefcase, TrendingUp, Atom, Flame, Globe, Heart, Music, Video, Zap, Layout, Terminal, Palette, Shield, Settings, Database, Cloud, Smartphone, Monitor
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories, createCategory, updateCategory, deleteCategory, uploadImage, type Category } from "@/lib/api";

// Available icons matching client side
const iconMap: Record<string, any> = {
  Cpu, Code, Brain, Briefcase, TrendingUp, Atom, Flame, Globe, Heart, Music, Video, Zap, Layout, Terminal, Palette, Shield, Settings, Database, Cloud, Smartphone, Monitor
};

const iconList = Object.keys(iconMap);

const AdminCategories = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  // New Category State
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newColor, setNewColor] = useState("#6366F1");
  const [newIcon, setNewIcon] = useState("Cpu");

  // Edit State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: getCategories,
  });

  const createM = useMutation({
    mutationFn: (data: Partial<Category>) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Category created!");
      setShowAddForm(false);
      setNewName("");
      setNewDescription("");
      setNewColor("#6366F1");
      setNewIcon("Cpu");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateM = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Category> }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      setEditingCategory(null);
      toast.success("Category updated!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteM = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Category deleted!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleAdd = () => {
    if (!newName.trim()) { toast.error("Name is required"); return; }
    createM.mutate({ name: newName, description: newDescription, color: newColor, icon: newIcon });
  };

  const handleUpdate = () => {
    if (!editingCategory) return;
    updateM.mutate({ id: editingCategory.id, data: editingCategory });
  };

  const handleFileUpload = async (file: File, isEdit: boolean) => {
    try {
      const { url } = await uploadImage(file);
      if (isEdit) {
        if (editingCategory) setEditingCategory({ ...editingCategory, icon: url });
      } else {
        setNewIcon(url);
      }
      toast.success("Icon uploaded!");
    } catch (error) {
      toast.error("Failed to upload icon");
    }
  };

  const renderIcon = (iconString: string, className = "w-4 h-4") => {
    if (iconString.startsWith("http") || iconString.startsWith("/")) {
      return <img src={iconString} alt="Icon" className={`${className} object-contain`} />;
    }
    const Icon = iconMap[iconString] || Cpu;
    return <Icon className={className} />;
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
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">Categories</h1>
            <p className="text-muted-foreground text-sm">Organize your topics into categories</p>
          </div>
          <Button className="gap-2" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </div>

        {/* Add Category Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">New Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Input placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} />
                  <Input placeholder="Description" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">Color:</label>
                    <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border" />
                  </div>
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Icon</label>
                  <div className="space-y-3">
                    {/* Preview Selected */}
                    <div className="flex items-center gap-3 p-3 border rounded-xl bg-secondary/20">
                      <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center border shadow-sm">
                        {renderIcon(newIcon, "w-5 h-5")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Selected: <span className="font-medium text-foreground">{newIcon.startsWith('http') ? 'Custom Image' : newIcon}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-6 gap-2 bg-secondary/50 p-2 rounded-lg max-h-32 overflow-y-auto">
                      {iconList.map((iconName) => {
                        const Icon = iconMap[iconName];
                        return (
                          <button
                            key={iconName}
                            type="button"
                            onClick={() => setNewIcon(iconName)}
                            className={`p-2 rounded-md flex items-center justify-center transition-colors ${newIcon === iconName ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-background"
                              }`}
                            title={iconName}
                          >
                            <Icon className="w-4 h-4" />
                          </button>
                        );
                      })}
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or upload image</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        className="text-xs"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, false);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                <Button onClick={handleAdd} disabled={createM.isPending}>
                  {createM.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            {editingCategory && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Name</label>
                      <Input
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Description</label>
                      <Input
                        value={editingCategory.description}
                        onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Color</label>
                      <input
                        type="color"
                        value={editingCategory.color}
                        onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                        className="w-full h-10 rounded cursor-pointer border"
                      />
                    </div>
                  </div>

                  {/* Icon Selection */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Icon</label>
                    <div className="space-y-3">
                      {/* Preview Selected */}
                      <div className="flex items-center gap-3 p-3 border rounded-xl bg-secondary/20">
                        <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center border shadow-sm">
                          {renderIcon(editingCategory.icon, "w-5 h-5")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Selected: <span className="font-medium text-foreground">{editingCategory.icon.startsWith('http') ? 'Custom Image' : editingCategory.icon}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-6 gap-2 bg-secondary/50 p-2 rounded-lg max-h-60 overflow-y-auto">
                        {iconList.map((iconName) => {
                          const Icon = iconMap[iconName];
                          return (
                            <button
                              key={iconName}
                              type="button"
                              onClick={() => setEditingCategory({ ...editingCategory, icon: iconName })}
                              className={`p-2 rounded-md flex items-center justify-center transition-colors ${editingCategory.icon === iconName ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-background"
                                }`}
                              title={iconName}
                            >
                              <Icon className="w-4 h-4" />
                            </button>
                          );
                        })}
                      </div>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">Or upload image</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          className="text-xs"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, true);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setEditingCategory(null)}>Cancel</Button>
                  <Button onClick={handleUpdate} disabled={updateM.isPending}>
                    {updateM.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Categories List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((cat, index) => {
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="hover:border-primary/30 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Icon & Color */}
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: cat.color + "20", color: cat.color }}>
                          {renderIcon(cat.icon, "w-6 h-6")}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-base">{cat.name}</p>
                          <p className="text-xs text-muted-foreground">{cat.description}</p>
                        </div>

                        {/* Topic Count */}
                        <Badge variant="secondary" className="shrink-0">{cat.topicCount} topics</Badge>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setEditingCategory(cat)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteM.mutate(cat.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            {categories.length === 0 && (
              <div className="text-center py-12">
                <h3 className="font-display text-xl font-semibold mb-2">No categories yet</h3>
                <p className="text-muted-foreground mb-4">Create your first category to get started</p>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Add Category
                </Button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default AdminCategories;
