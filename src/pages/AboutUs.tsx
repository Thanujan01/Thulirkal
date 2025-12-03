import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Palette, Sparkles, CheckCircle } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-14">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 animate-fade-in">
            About Our Craft
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every piece tells a story of passion, creativity, and dedication
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-2 py-0">

        {/* Our Mission */}
          <div className="bg-muted p-6 rounded-lg mt-5">
            <h2 className="text-3xl font-serif font-bold mb-4">Our Mission</h2>
            <p className="text-lg leading-relaxed text-foreground text-justify">
              Our mission is to keep traditional craftsmanship alive while creating contemporary
              pieces that fit modern lifestyles. We aim to provide beautiful, sustainable alternatives
              to mass-produced items, supporting local artisans and promoting the value of handmade goods.
              Each purchase not only brings a unique piece into your home but also supports the
              continuation of these valuable craft traditions.
            </p>
          </div>
        

          {/* Values */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <Card className="shadow-card hover-lift">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif font-bold text-xl mb-3">Made with Love</h3>
                <p className="text-muted-foreground">
                  Every piece is crafted with care and passion, ensuring that you receive
                  something truly special.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover-lift">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-serif font-bold text-xl mb-3">Unique Designs</h3>
                <p className="text-muted-foreground">
                  No two pieces are exactly alike. Each creation is unique, adding character
                  to your space.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover-lift">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-serif font-bold text-xl mb-3">Quality Materials</h3>
                <p className="text-muted-foreground">
                  We use only the finest materials to ensure durability and beauty in every
                  handmade piece.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover-lift">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif font-bold text-xl mb-3">Customizable</h3>
                <p className="text-muted-foreground">
                  We offer customization options — from colors to sizes — to make each piece
                  truly yours. Contact us to discuss custom orders.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-4xl mx-auto space-y-20 mt-10">
          {/* Main Story */}
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed text-foreground text-justify">
              Welcome to our world of handcrafted treasures! We are a passionate team of artisans
              dedicated to creating unique, one-of-a-kind pieces that bring beauty and joy to your life.
              Each product is carefully crafted with attention to detail, using quality materials and
              time-honored techniques passed down through generations.
            </p>
            <p className="text-lg leading-relaxed text-foreground mt-4 text-justify">
              Our journey began with a simple love for creating beautiful things by hand. What started
              as a hobby has blossomed into a thriving creative endeavor, bringing together various
              crafts including paper art, resin work, pottery, and more. We believe that handmade
              items carry a special energy and character that mass-produced goods simply cannot match.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
