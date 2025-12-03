import { useMemo, useState, ChangeEvent } from "react";
import { Navbar } from "@/components/Navbar";
import { SellerTable } from "@/components/SellerTable";
import { sellers } from "@/data/sellers";
import { Input } from "@/components/ui/input";
import NotFound from "./NotFound";

const Admin = () => {
  const [query, setQuery] = useState("");

  // Protect route: only accessible after successful admin login
  if (typeof window !== "undefined") {
    const isAdmin = sessionStorage.getItem("isAdmin") === "true";
    if (!isAdmin) {
      return <NotFound />;
    }
  }

  const filteredSellers = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) {
      return sellers;
    }

    return sellers.filter((seller) => {
      const haystack = `${seller.id} ${seller.name} ${seller.address}`.toLowerCase();
      return haystack.includes(keyword);
    });
  }, [query]);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="container mx-auto px-4 py-12 space-y-8">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Admin Portal</p>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-serif font-bold mb-3">Seller Management</h1>
              <p className="text-muted-foreground">
                Search by Seller ID, business name, or address to quickly locate seller information.
                Results update instantly as you type.
              </p>
            </div>
            <div className="w-full lg:w-80 space-y-2">
              <label htmlFor="seller-search" className="text-sm font-medium text-foreground">
                Search Sellers
              </label>
              <Input
                id="seller-search"
                placeholder="Search by ID / Name / Address"
                value={query}
                onChange={handleQueryChange}
              />
              <p className="text-xs text-muted-foreground">
                Showing {filteredSellers.length} of {sellers.length} sellers
              </p>
            </div>
          </div>
        </div>

        <SellerTable sellers={filteredSellers} />
      </section>
    </div>
  );
};

export default Admin;

