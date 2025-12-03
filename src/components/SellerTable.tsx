import { Seller } from "@/types/seller";

interface SellerTableProps {
  sellers: Seller[];
}

export const SellerTable = ({ sellers }: SellerTableProps) => {
  const sortedSellers = [...sellers].sort((a, b) =>
    a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: "base" })
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-border shadow-card">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-muted/50 text-muted-foreground uppercase tracking-wide text-xs">
          <tr>
            <th className="px-4 py-3 font-semibold">ID</th>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Address</th>
            <th className="px-4 py-3 font-semibold">Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {sortedSellers.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                No sellers found.
              </td>
            </tr>
          ) : (
            sortedSellers.map((seller) => (
              <tr key={seller.id} className="border-t border-border">
                <td className="px-4 py-3 font-semibold">{seller.id}</td>
                <td className="px-4 py-3">{seller.name}</td>
                <td className="px-4 py-3">{seller.address}</td>
                <td className="px-4 py-3">{seller.phone}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

