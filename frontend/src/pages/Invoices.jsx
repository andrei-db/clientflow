import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { apiFetch } from "../lib/api";
import { Plus } from "lucide-react";
import InvoiceModal from "../components/InvoiceModal";
export default function Invoices() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    async function loadInvoices() {
        setLoading(true);

        const { res, data } = await apiFetch("/api/invoices");

        if (res.ok) {
            setInvoices(data.invoices);
        }

        setLoading(false);
    }

    useEffect(() => {
        loadInvoices();
    }, []);

    return (
        <MainLayout>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <p className="text-sm text-neutral-500">Billing</p>
                    <h2 className="text-4xl font-bold tracking-tight">Invoices</h2>
                </div>

                <button onClick={() => setModalOpen(true)}
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

                            <div className="text-right">
                                <p className="font-semibold">€{invoice.amount}</p>
                                <p className="text-sm text-neutral-500">{invoice.status}</p>
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
                onClose={() => setModalOpen(false)}
                onInvoiceCreated={(newInvoice) =>
                    setInvoices((prev) => [newInvoice, ...prev])
                }
            />
        </MainLayout>
    );
}