import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Shield, Scale, Cookie } from "lucide-react";
import { useLocation } from "react-router-dom";

const Legal = () => {
    const location = useLocation();
    const path = location.pathname.substring(1); // remove leading slash

    const content = {
        privacy: {
            title: "Privacy Policy",
            icon: Shield,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            text: `
        <h2>1. Introduction</h2>
        <p>Welcome to LearnFlow. We respect your privacy and are committed to protecting your personal data.</p>
        
        <h2>2. Data We Collect</h2>
        <p>We may collect personal identification information (Name, email address, phone number, etc.) when you register on our site.</p>
        
        <h2>3. How We Use Your Data</h2>
        <p>We use your data to provide and improve our services, communicate with you, and ensure platform security.</p>
        
        <h2>4. Data Security</h2>
        <p>We implement appropriate technical and organizational measures to protect your personal data.</p>
        `
        },
        terms: {
            title: "Terms of Service",
            icon: Scale,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            text: `
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using LearnFlow, you accept and agree to be bound by the terms and provision of this agreement.</p>
        
        <h2>2. Use License</h2>
        <p>Permission is granted to temporarily download one copy of the materials (information or software) on LearnFlow's website for personal, non-commercial transitory viewing only.</p>
        
        <h2>3. Disclaimer</h2>
        <p>The materials on LearnFlow's website are provided on an 'as is' basis. LearnFlow makes no warranties, expressed or implied.</p>
        `
        },
        cookies: {
            title: "Cookie Policy",
            icon: Cookie,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            text: `
        <h2>1. What Are Cookies</h2>
        <p>Cookies are small text files that are placed on your computer by websites that you visit.</p>
        
        <h2>2. How We Use Cookies</h2>
        <p>We use cookies to make our website work more efficiently, as well as to provide information to the owners of the site.</p>
        
        <h2>3. Your Choices</h2>
        <p>You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer.</p>
        `
        }
    };

    const pageData = content[path as keyof typeof content] || content.privacy;
    const Icon = pageData.icon;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-32 pb-20 px-4 md:px-8">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${pageData.bg} mb-6`}>
                            <Icon className={`w-8 h-8 ${pageData.color}`} />
                        </div>

                        <h1 className="font-display text-4xl font-bold mb-4 text-foreground">
                            {pageData.title}
                        </h1>
                        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg dark:prose-invert mx-auto bg-card border border-border/50 p-8 md:p-12 rounded-3xl shadow-sm">
                        <div dangerouslySetInnerHTML={{ __html: pageData.text }} />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Legal;
