import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Mail, MessageSquare, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Message Sent",
            description: "We've received your message and will get back to you soon.",
        });
        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* Info Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary mb-6 border border-primary/20">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm font-medium">Contact Us</span>
                        </div>

                        <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 text-foreground">
                            Get in <span className="gradient-text">Touch</span>
                        </h1>

                        <p className="text-muted-foreground text-lg mb-12">
                            Have questions about LearnFlow? We're here to help. Whether you're curious about features, pricing, or enterprise solutions.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                                    <Mail className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Email Us</h3>
                                    <p className="text-muted-foreground">support@learnflow.com</p>
                                    <p className="text-muted-foreground">partnerships@learnflow.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                                    <MessageSquare className="w-6 h-6 text-purple-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Live Chat</h3>
                                    <p className="text-muted-foreground">Available Mon-Fri, 9am - 5pm EST</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                                    <MapPin className="w-6 h-6 text-green-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Office</h3>
                                    <p className="text-muted-foreground">123 Innovation Dr, Suite 400</p>
                                    <p className="text-muted-foreground">San Francisco, CA 94107</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Form Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-card border border-border/50 p-8 rounded-3xl h-fit"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2" htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-background border border-border focus:border-primary outline-none transition-colors"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-background border border-border focus:border-primary outline-none transition-colors"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full p-3 rounded-xl bg-background border border-border focus:border-primary outline-none transition-colors min-h-[150px]"
                                    placeholder="How can we help you?"
                                    required
                                />
                            </div>

                            <Button type="submit" size="lg" className="w-full rounded-xl h-12 text-base">
                                Send Message
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Contact;
