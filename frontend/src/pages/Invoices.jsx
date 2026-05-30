import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { apiFetch } from "../lib/api";
import { Plus, Pencil, Trash2 } from "lucide-react";
import InvoiceModal from "../components/InvoiceModal";

export default function Invoices() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState(null);

    useEffect(() => {
        loadInvoices();
    }, []);

    async function loadInvoices() {
        setLoading(true);

        const { res, data } = await apiFetch("/api/invoices");

        if (res.ok) {
            setInvoices(data.invoices);
        }

        setLoading(false);
    }



    async function handleDeleteInvoice(id) {
        const { res } = await apiFetch(`/api/invoices/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) return;

        setInvoices((prev) =>
            prev.filter((invoice) => invoice.id !== id)
        );
    }

    return (
        <MainLayout>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <p className="text-sm text-neutral-500">Billing</p>
                    <h2 className="text-4xl font-bold tracking-tight">Invoices</h2>
                </div>

                <button onClick={() => {
                    setEditingInvoice(null);
                    setModalOpen(true);
                }}
                    className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-neutral-200">
                    <Plus size={18} />
                    Add invoice
                </button>
            </div>

            {loading && <p className="text-sm text-neutral-500">Loading invoices...</p>}

            {!loading && (
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden">
                    {invoices.map((invoice) => (
                        <div
                            key={invoice.id}
                            className="flex items-center justify-between border-b border-white/10 px-6 py-5 last:border-b-0"
                        >
                            <div>
                                <p className="font-semibold">{invoice.number}</p>
                                <p className="text-sm text-neutral-500">
                                    {invoice.client?.name} — {invoice.client?.company}
                                </p>
                            </div>

                            <div className="text-right flex items-center gap-5">
                                <p className="font-semibold">€{invoice.amount}</p>
                                <p className="text-sm text-neutral-500">{invoice.status}</p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingInvoice(invoice);
                                            setModalOpen(true);
                                        }}
                                        className="rounded-xl p-2 text-neutral-500 hover:bg-white/10 hover:text-white"
                                    >
                                        <Pencil size={16} />
                                    </button>

                                    <button
                                        onClick={() => handleDeleteInvoice(invoice.id)}
                                        className="rounded-xl p-2 text-neutral-500 hover:bg-red-500/10 hover:text-red-400"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>


                        </div>
                    ))}

                    {invoices.length === 0 && (
                        <p className="p-6 text-sm text-neutral-500">
                            No invoices yet.
                        </p>
                    )}
                </div>
            )}
            <InvoiceModal
                open={modalOpen}
                editingInvoice={editingInvoice}
                onClose={() => {
                    setModalOpen(false);
                    setEditingInvoice(null);
                }}
                onInvoiceSaved={(savedInvoice) => {
                    setInvoices((prev) => {
                        const exists = prev.some(
                            (invoice) => invoice.id === savedInvoice.id
                        );

                        if (exists) {
                            return prev.map((invoice) =>
                                invoice.id === savedInvoice.id ? savedInvoice : invoice
                            );
                        }

                        return [savedInvoice, ...prev];
                    });
                }}
            />
        </MainLayout>
    );
}