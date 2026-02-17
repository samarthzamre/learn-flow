import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Code, Cpu, TrendingUp, Briefcase, Atom, Flame, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, type CategoryItem } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Icon mapping from string name to component
const iconMap: Record<string, React.ElementType> = {
    Cpu, Code, Brain, Briefcase, TrendingUp, Atom, Flame,
};

const Categories = () => {
    const { data: categories = [], isLoading } = useQuery({
        queryKey: ["client-categories-all"],
        queryFn: getCategories,
    });

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary mb-6 border border-primary/20">
                            <span className="text-sm font-medium">Browse All</span>
                        </div>

                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
                            Explore <span className="gradient-text">Categories</span>
                        </h1>

                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Discover a wide range of topics organized by category. From technology to business, find your next learning path.
                        </p>
                    </motion.div>

                    {/* Categories Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-64 rounded-2xl bg-secondary/30 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.map((cat, index) => {
                                const Icon = iconMap[cat.icon] || Cpu;
                                return (
                                    <motion.div
                                        key={cat.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                        className="h-full"
                                    >
                                        <Link to={`/explore?category=${cat.slug}`} className="block h-full">
                                            <div className="card-hover group rounded-3xl border border-border/50 bg-card p-6 h-full transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden">
                                                {/* Background Decoration */}
                                                <div
                                                    className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 duration-500"
                                                    style={{ backgroundColor: cat.color }}
                                                />

                                                <div className="relative z-10 flex flex-col h-full items-start text-left">
                                                    <div
                                                        className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm"
                                                        style={{ backgroundColor: cat.color }}
                                                    >
                                                        <Icon className="w-6 h-6 text-white" />
                                                    </div>

                                                    <h3 className="font-display text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                                                        {cat.name}
                                                    </h3>

                                                    <p className="text-muted-foreground text-sm mb-4 flex-1 leading-relaxed">
                                                        {cat.description}
                                                    </p>

                                                    <div className="flex items-center justify-between w-full pt-4 border-t border-border/50">
                                                        <span
                                                            className="text-xs font-bold"
                                                            style={{ color: cat.color }}
                                                        >
                                                            {cat.topicCount} topics
                                                        </span>
                                                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                            <ArrowRight className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && categories.length === 0 && (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="font-display text-xl font-semibold mb-2">No categories found</h3>
                            <p className="text-muted-foreground">Admin hasn't added any categories yet.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Categories;
