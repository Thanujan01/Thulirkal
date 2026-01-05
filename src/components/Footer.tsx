import { Facebook, Instagram, Linkedin, MapPin, Mail, Phone } from "lucide-react";
import { FaTiktok, FaPinterest } from "react-icons/fa";
import { SOCIAL_LINKS, APP_URLS } from "@/config/constants";

export const Footer = () => {
    return (
        <footer className="bg-muted mt-12 pt-12 pb-8 border-t border-border">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <h3 className="font-serif font-bold text-2xl text-primary">Thulirkal</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            The premier marketplace for authentic handmade, handcrafted, and eco-friendly artisan goods.
                            Discover unique treasures directly from India's finest makers.
                        </p>
                    </div>

                    {/* Quick Links Column */}
                    <div>
                        <h4 className="font-bold text-lg mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <a href={APP_URLS.HOME} className="hover:text-primary transition-colors">Home</a>
                            </li>

                            <li>
                                <a href={APP_URLS.ABOUT} className="hover:text-primary transition-colors">About Us</a>
                            </li>
                            <li>
                                <a href={APP_URLS.CONTACT} className="hover:text-primary transition-colors">Contact Us</a>
                            </li>

                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h4 className="font-bold text-lg mb-4">Contact Us</h4>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                <span>
                                    Jaffna,<br />
                                    Sri Lanka
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                                <a href={`tel:+940769823735`} className="hover:text-primary">
                                    +94 076 982 3735
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                                <a href="mailto:support@thulirkal.com" className="hover:text-primary">
                                    support@thulirkal.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Social Column */}
                    <div>
                        <h4 className="font-bold text-lg mb-4">Follow Us</h4>
                        <p className="text-muted-foreground text-sm mb-4">
                            Join our community of art lovers and stay updated with new collections.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href={SOCIAL_LINKS.FACEBOOK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href={SOCIAL_LINKS.INSTAGRAM}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href={SOCIAL_LINKS.PINTEREST}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                                aria-label="Pinterest"
                            >
                                <FaPinterest className="h-5 w-5" />
                            </a>
                            <a
                                href={SOCIAL_LINKS.LINKEDIN}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Thulirkal. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};
