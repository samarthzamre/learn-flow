import { ShieldAlert } from "lucide-react";

const Maintenance = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-background">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <ShieldAlert className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Under Maintenance
            </h1>
            <p className="text-muted-foreground max-w-md text-lg">
                We're currently performing scheduled maintenance to improve your experience.
                Please check back soon.
            </p>
        </div>
    );
};

export default Maintenance;
