import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Sparkles, Users, Target, Zap } from "lucide-react";

const About = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-20 px-4 md:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary mb-6 border border-primary/20">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-medium">Our Mission</span>
                        </div>

                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
                            We're changing how the <br /> <span className="gradient-text">world learns</span>
                        </h1>

                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                            LearnFlow is on a mission to democratize knowledge through visual learning. We believe that complex topics shouldn't be hard to understand.
                        </p>
                    </motion.div>

                    {/* Values Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        {[
                            {
                                icon: Target,
                                title: "Simplicity First",
                                description: "We break down complex concepts into their simplest components without losing depth.",
                                color: "bg-blue-500"
                            },
                            {
                                icon: Zap,
                                title: "Visual Learning",
                                description: "Our brain processes images 60,000x faster than text. We leverage this to speed up learning.",
                                color: "bg-amber-500"
                            },
                            {
                                icon: Users,
                                title: "Community Driven",
                                description: "Knowledge grows when shared. We're building a community of lifelong learners.",
                                color: "bg-purple-500"
                            }
                        ].map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-card border border-border/50 p-8 rounded-3xl text-center hover:shadow-lg transition-all"
                            >
                                <div className={`w-12 h-12 rounded-xl ${value.color}/10 flex items-center justify-center mx-auto mb-6`}>
                                    <value.icon className={`w-6 h-6 text-${value.color.replace('bg-', '')}`} />
                                </div>
                                <h3 className="font-display text-xl font-bold mb-3">{value.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Story Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="prose prose-lg dark:prose-invert mx-auto text-center"
                    >
                        <h2 className="font-display text-3xl font-bold mb-6">Our Story</h2>
                        <p className="text-muted-foreground mb-6">
                            Founded in 2024, LearnFlow started with a simple observation: existing learning platforms were either too shallow or too academic.
                            We wanted to build something in between—a place where you could grasp the core of Quantum Computing or Modern Monetary Theory over a coffee break.
                        </p>
                        <p className="text-muted-foreground">
                            Today, we're helping thousands of learners across the globe master new topics every day using our unique card-based visual summaries.
                        </p>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default About;
