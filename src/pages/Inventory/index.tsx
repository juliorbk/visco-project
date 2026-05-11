import { useState } from "react";
import InventoryModal, {
  type InventoryItem,
} from "../../components/Inventory/InventoryModal";

type ModalMode = "add" | "edit" | "delete" | null;

const initialItems: InventoryItem[] = [
  {
    id: 1,
    name: "Steel Pipes",
    sku: "SP-001",
    category: "Materials",
    stock: 150,
    status: "In Stock",
  },
  {
    id: 2,
    name: "Copper Wire",
    sku: "CW-002",
    category: "Electrical",
    stock: 45,
    status: "Low Stock",
  },
  {
    id: 3,
    name: "Concrete Mix",
    sku: "CM-003",
    category: "Materials",
    stock: 200,
    status: "In Stock",
  },
  {
    id: 4,
    name: "Safety Helmet",
    sku: "SH-004",
    category: "Safety",
    stock: 0,
    status: "Out of Stock",
  },
];

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [nextId, setNextId] = useState(5);

  const openAdd = () => {
    setSelectedItem(null);
    setModalMode("add");
  };
  const openEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setModalMode("edit");
  };
  const openDelete = (item: InventoryItem) => {
    setSelectedItem(item);
    setModalMode("delete");
  };
  const closeModal = () => {
    setModalMode(null);
    setSelectedItem(null);
  };

  const handleSave = (data: Omit<InventoryItem, "id"> & { id?: number }) => {
    if (data.id) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === data.id ? ({ ...data, id: data.id } as InventoryItem) : i,
        ),
      );
    } else {
      setItems((prev) => [...prev, { ...data, id: nextId } as InventoryItem]);
      setNextId((n) => n + 1);
    }
  };

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const filtered = items.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      categoryFilter === "All Categories" || item.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const categories = [
    "All Categories",
    ...Array.from(new Set(items.map((i) => i.category))),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Inventory</h2>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Add Item</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "SKU", "Category", "Stock", "Status", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-sm text-gray-400"
                >
                  No items found. Try adjusting your search or filters.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {item.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === "In Stock"
                          ? "bg-green-100 text-green-800"
                          : item.status === "Low Stock"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => openEdit(item)}
                      className="text-teal-600 hover:text-teal-900 font-medium mr-4 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDelete(item)}
                      className="text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {filtered.length} of {items.length} items
          </div>
        )}
      </div>

      <InventoryModal
        mode={modalMode}
        item={selectedItem}
        onClose={closeModal}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
