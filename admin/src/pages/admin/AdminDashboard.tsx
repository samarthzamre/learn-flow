import { motion } from "framer-motion";
import {
  FileText,
  Users,
  TrendingUp,
  Eye,
  Plus,
  ArrowUpRight,
  BarChart3,
  Sparkles,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { getStats, getTopics } from "@/lib/api";

const statIcons = [FileText, Eye, TrendingUp, BarChart3];

const AdminDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getStats,
  });

  const { data: recentTopics, isLoading: topicsLoading } = useQuery({
    queryKey: ["admin-topics-recent"],
    queryFn: () => getTopics(),
  });

  const statCards = stats
    ? [
      { label: "Total Topics", value: String(stats.totalTopics), icon: FileText, change: `${stats.publishedTopics} published` },
      { label: "Total Views", value: stats.totalViews >= 1000 ? `${(stats.totalViews / 1000).toFixed(1)}K` : String(stats.totalViews), icon: Eye, change: "All time" },
      { label: "Trending Topics", value: String(stats.trendingTopics), icon: TrendingUp, change: "Score ≥ 80" },
      { label: "Categories", value: String(stats.totalCategories), icon: BarChart3, change: "Active" },
    ]
    : [];

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">Dashboard</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Welcome back! Here's what's happening with your platform.
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/research">
              <Button variant="outline" className="gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Topic Research</span>
              </Button>
            </Link>
            <Link to="/admin/topics/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                <span>New Topic</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        {statsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                      </div>
                      <p className="font-display text-2xl md:text-3xl font-bold mb-1">{stat.value}</p>
                      <p className="text-muted-foreground text-xs md:text-sm">{stat.label}</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{stat.change}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Recent Topics & Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Topics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg">Recent Topics</CardTitle>
                <Link to="/admin/topics">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {topicsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(recentTopics || []).slice(0, 4).map((topic) => (
                      <div
                        key={topic.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{topic.title}</p>
                          <p className="text-xs text-muted-foreground">{topic.categoryName}</p>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium">{topic.views >= 1000 ? `${(topic.views / 1000).toFixed(1)}K` : topic.views}</p>
                            <p className="text-xs text-muted-foreground">views</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${topic.status === "Published"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-amber-500/10 text-amber-600"
                            }`}>
                            {topic.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/admin/topics/new" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <Plus className="w-4 h-4" />
                    Create New Topic
                  </Button>
                </Link>
                <Link to="/admin/research" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <Sparkles className="w-4 h-4" />
                    Topic Research
                  </Button>
                </Link>
                <Link to="/admin/categories" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <FileText className="w-4 h-4" />
                    Manage Categories
                  </Button>
                </Link>
                <Link to="/admin/analytics" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <BarChart3 className="w-4 h-4" />
                    View Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminDashboard;
