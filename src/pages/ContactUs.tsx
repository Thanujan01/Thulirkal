import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageCircle, Phone, MapPin } from "lucide-react";
import { SOCIAL_LINKS } from "@/config/constants";

const ContactUs = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    userId: "",
    password: "",
    note: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleWhatsAppClick = () => {
    window.open(SOCIAL_LINKS.WHATSAPP, "_blank", "noopener,noreferrer");
  };

  const isAdminCredentials = (userId: string, password: string) =>
    userId.trim() === "Thanujan" && password === "ThanuThamil@0513";

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setStatusMessage(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedUserId = formValues.userId.trim();
    const trimmedNote = formValues.note.trim();
    const isAdmin = isAdminCredentials(formValues.userId, formValues.password);

    if (isAdmin) {
      // Mark admin session so /admin route is protected
      try {
        sessionStorage.setItem("isAdmin", "true");
      } catch {
        // ignore if storage is unavailable
      }
      navigate("/admin");
      return;
    }

    if (!trimmedUserId || !formValues.password || !trimmedNote) {
      setStatusMessage({
        type: "error",
        message: "Please fill User ID, Password, and Note.",
      });
      return;
    }

    setStatusMessage({
      type: "success",
      message: "Submitted",
    });
    setFormValues({
      userId: "",
      password: "",
      note: "",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 animate-fade-in">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions or want to place an order? We'd love to hear from you!
            <p>&</p>
            Contact us to Sell your handcrafted products on our platform.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6">Contact Information</h2>
              <p className="text-muted-foreground mb-8">
                Feel free to reach out to us. We typically respond within 24 hours.
              </p>
            </div>

            <Card className="shadow-card">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">WhatsApp</h3>
                    <p className="text-muted-foreground mb-3">
                      Chat with us directly for quick responses
                    </p>
                    <Button onClick={handleWhatsAppClick} variant="outline" size="sm">
                      Open WhatsApp
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-muted-foreground">
                      +94 0769823735
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-muted-foreground">
                      Sri Lanka
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card mt-6">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Sell With Us</h3>
                <p className="text-muted-foreground mb-4">
                  Would you like to sell your handcrafted products on our platform? We'd love to
                  hear from creators and small businesses.
                </p>
                <Button onClick={handleWhatsAppClick}>Contact to Sell (WhatsApp)</Button>
              </CardContent>
            </Card>

            <Card className="shadow-card mt-6">
              <CardContent className="p-6 space-y-5">
                <div>
                  <h3 className="font-semibold mb-2">Send Your Note</h3>
                  <p className="text-muted-foreground text-sm">
                    Only for Authorized Users.
                  </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="userId">User ID</Label>
                    <Input
                      id="userId"
                      name="userId"
                      value={formValues.userId}
                      onChange={handleInputChange}
                      placeholder="Enter your user ID"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formValues.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        required
                        className="pr-20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-2 my-1 px-2 text-xs font-medium rounded-md border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      >
                        {showPassword ? "Hide" : "View"}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note">Note</Label>
                    <Textarea
                      id="note"
                      name="note"
                      value={formValues.note}
                      onChange={handleInputChange}
                      placeholder="Add your note"
                      required={!isAdminCredentials(formValues.userId, formValues.password)}
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      
                    </p>
                  </div>

                  {statusMessage && (
                    <p
                      className={`text-sm font-medium ${
                        statusMessage.type === "success" ? "text-green-600" : "text-destructive"
                      }`}
                    >
                      {statusMessage.message}
                    </p>
                  )}

                  <Button type="submit" className="w-full">
                    Submit
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
      </section>
    </div>
  );
};

export default ContactUs;
