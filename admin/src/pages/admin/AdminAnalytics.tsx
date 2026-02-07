import { motion } from "framer-motion";
import { 
  Eye, 
  TrendingUp, 
  Clock,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin/AdminLayout";

const overviewStats = [
  { label: "Total Views", value: "45.2K", change: "+12.5%", positive: true, icon: Eye },
  { label: "Avg. Read Time", value: "4:32", change: "+8.2%", positive: true, icon: Clock },
  { label: "Completion Rate", value: "68%", change: "-2.1%", positive: false, icon: BarChart3 },
  { label: "Trending Score", value: "87", change: "+15.3%", positive: true, icon: TrendingUp },
];

const topTopics = [
  { title: "Large Language Models", views: "2,847", completion: "78%", trend: "+24%" },
  { title: "React Server Components", views: "1,932", completion: "72%", trend: "+18%" },
  { title: "Quantum Computing Basics", views: "1,456", completion: "65%", trend: "+12%" },
  { title: "Startup Fundraising", views: "1,203", completion: "81%", trend: "+8%" },
  { title: "Neural Networks Deep Dive", views: "987", completion: "59%", trend: "+5%" },
];

const categoryStats = [
  { name: "AI & ML", views: "12.4K", percentage: 28 },
  { name: "Programming", views: "10.8K", percentage: 24 },
  { name: "Tech", views: "8.2K", percentage: 18 },
  { name: "Business", views: "6.5K", percentage: 15 },
  { name: "Science", views: "4.2K", percentage: 10 },
  { name: "Finance", views: "3.1K", percentage: 7 },
];

const AdminAnalytics = () => {
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">Analytics</h1>
          <p className="text-muted-foreground text-sm">
            Track your platform's performance and engagement
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
          {overviewStats.map((stat, index) => {
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
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-medium ${
                        stat.positive ? "text-emerald-600" : "text-red-500"
                      }`}>
                        {stat.positive ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {stat.change}
                      </div>
                    </div>
                    <p className="font-display text-2xl md:text-3xl font-bold mb-1">{stat.value}</p>
                    <p className="text-muted-foreground text-xs md:text-sm">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Topics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Top Performing Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topTopics.map((topic, index) => (
                    <div key={topic.title} className="flex items-center gap-4">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{topic.title}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{topic.views} views</span>
                          <span>{topic.completion} completion</span>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-emerald-600">{topic.trend}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Views by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryStats.map((category) => (
                    <div key={category.name}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{category.name}</span>
                        <span className="text-sm text-muted-foreground">{category.views}</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${category.percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.5 }}
                          className="h-full bg-primary rounded-full"
                        />
                      </div>
                    </div>
                  ))}
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
