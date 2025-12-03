import { Navbar } from "@/components/Navbar";
import { SellerTable } from "@/components/SellerTable";
import { sellers } from "@/data/sellers";

const Sellers = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-10">
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Directory</p>
            <h1 className="text-4xl font-serif font-bold mb-4">Registered Sellers</h1>
            <p className="text-muted-foreground">
              Browse all sellers who currently provide handcrafted products on our platform. IDs
              follow the format SE001, SE002, and so on for quick reference.
            </p>
          </div>

          <SellerTable sellers={sellers} />

          <p className="text-xs text-muted-foreground mt-4">
            Need to add or update a seller? Edit the list in <code>src/data/sellers.ts</code> and redeploy.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Sellers;

