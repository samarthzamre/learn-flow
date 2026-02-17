import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Eye,
  FileText,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { getStats, getTopics, getCategories } from "@/lib/api";

const AdminAnalytics = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getStats,
  });

  const { data: topics = [] } = useQuery({
    queryKey: ["admin-topics"],
    queryFn: () => getTopics(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: getCategories,
  });

  // Derive analytics from real data
  const topPerformingTopics = [...topics]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const viewsByCategory = categories
    .map((cat) => {
      const catTopics = topics.filter((t) => t.categoryName === cat.name);
      const totalViews = catTopics.reduce((sum, t) => sum + t.views, 0);
      return { name: cat.name, views: totalViews, color: cat.color };
    })
    .filter((c) => c.views > 0)
    .sort((a, b) => b.views - a.views);

  const maxViews = viewsByCategory.length > 0 ? viewsByCategory[0].views : 1;

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-6 h-6 text-primary" />
            <h1 className="font-display text-2xl md:text-3xl font-bold">Analytics</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Platform performance and engagement metrics
          </p>
        </div>

        {/* Overview Stats */}
        {statsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
            {[
              { label: "Total Views", value: stats ? (stats.totalViews >= 1000 ? `${(stats.totalViews / 1000).toFixed(1)}K` : String(stats.totalViews)) : "0", icon: Eye },
              { label: "Published Topics", value: String(stats?.publishedTopics || 0), icon: FileText },
              { label: "Trending Topics", value: String(stats?.trendingTopics || 0), icon: TrendingUp },
              { label: "Categories", value: String(stats?.totalCategories || 0), icon: BarChart3 },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">{stat.label}</span>
                      </div>
                      <p className="font-display text-2xl font-bold">{stat.value}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Performing Topics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Top Performing Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformingTopics.map((topic, index) => (
                    <div key={topic.id} className="flex items-center gap-3">
                      <span className="w-6 text-center font-bold text-primary">{index + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{topic.title}</p>
                        <p className="text-xs text-muted-foreground">{topic.categoryName}</p>
                      </div>
                      <span className="text-sm font-medium">
                        {topic.views >= 1000 ? `${(topic.views / 1000).toFixed(1)}K` : topic.views}
                      </span>
                    </div>
                  ))}
                  {topPerformingTopics.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No topics yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Views by Category */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Views by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {viewsByCategory.map((cat) => (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{cat.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {cat.views >= 1000 ? `${(cat.views / 1000).toFixed(1)}K` : cat.views} views
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full transition-all"
                          style={{
                            width: `${Math.max((cat.views / maxViews) * 100, 5)}%`,
                            backgroundColor: cat.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  {viewsByCategory.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No view data yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
