"use client";

import { useEffect, useState } from "react";
import { 
  MessageSquare, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  RefreshCw, 
  User, 
  ArrowRight,
  MoreVertical,
  Inbox
} from "lucide-react";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/support");
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (ticketId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "UPDATE_STATUS", ticketId, newStatus })
      });
      if (res.ok) {
        fetchTickets();
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(t => filter === "ALL" || t.status === filter);

  const StatusBadge = ({ status }: { status: string }) => {
    const colors: any = {
      OPEN: "bg-red-500/20 text-red-400 border-red-500/30",
      IN_PROGRESS: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      CLOSED: "bg-green-500/20 text-green-400 border-green-500/30",
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${colors[status]}`}>
        {status}
      </span>
    );
  };

  const PriorityBadge = ({ priority }: { priority: string }) => {
    const icons: any = {
      HIGH: <AlertTriangle className="w-3 h-3 text-red-500" />,
      MEDIUM: <Clock className="w-3 h-3 text-yellow-500" />,
      URGENT: <AlertTriangle className="w-3 h-3 text-purple-500 animate-pulse" />,
    };
    return (
      <div className="flex items-center gap-1">
        {icons[priority]}
        <span className="text-[10px] text-gray-400 font-bold uppercase">{priority}</span>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-[#022c22] border border-[#c5a059]/30 px-3 py-1 rounded-full text-xs font-bold text-[#c5a059] mb-3">
            <MessageSquare className="w-3 h-3" />
            <span>Customer Success & Operations</span>
          </div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            Support Ticketing System
          </h1>
          <p className="text-gray-400 mt-2 max-w-2xl text-sm">
            Verwalten Sie Supportanfragen von Retail-Investoren und institutionellen Partnern. Schnelle Reaktionszeiten sichern das Vertrauen in die Amanah-Plattform.
          </p>
        </div>
        <button onClick={fetchTickets} className="bg-[#03362a] border border-[#064e3b] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#064e3b] transition-all flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Sync Tickets
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-5">
           <p className="text-xs text-gray-500 uppercase font-bold mb-1">Offene Tickets</p>
           <p className="text-2xl font-bold text-red-400">{tickets.filter(t => t.status === "OPEN").length}</p>
        </div>
        <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-5">
           <p className="text-xs text-gray-500 uppercase font-bold mb-1">Durchschn. Antwortzeit</p>
           <p className="text-2xl font-bold text-white">42 Min.</p>
        </div>
        <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-5">
           <p className="text-xs text-gray-500 uppercase font-bold mb-1">Gelöste Anfragen (YTD)</p>
           <p className="text-2xl font-bold text-green-400">1.240</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#03362a] border border-[#064e3b]/40 rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-2">
          {["ALL", "OPEN", "IN_PROGRESS", "CLOSED"].map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === f ? "bg-[#c5a059] text-[#022c22]" : "text-gray-400 hover:bg-[#064e3b]"}`}
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
           <input type="text" placeholder="Tickets suchen..." className="w-full bg-[#022c22] border border-[#064e3b] text-white text-sm rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-[#c5a059]"/>
        </div>
      </div>

      {/* Ticket List */}
      <div className="bg-[#03362a]/30 border border-[#064e3b]/40 rounded-2xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 divide-y divide-[#064e3b]/50">
          {isLoading && tickets.length === 0 ? (
            <div className="p-12 text-center">
               <RefreshCw className="w-8 h-8 text-[#c5a059] animate-spin mx-auto mb-4" />
               <p className="text-gray-400">Lade Tickets...</p>
            </div>
          ) : filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <div key={ticket.id} className="p-5 hover:bg-[#064e3b]/20 transition-all group">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <PriorityBadge priority={ticket.priority} />
                      <h3 className="font-bold text-white group-hover:text-[#c5a059] transition-colors">{ticket.subject}</h3>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2">{ticket.message}</p>
                    <div className="flex items-center gap-4 pt-2">
                       <span className="flex items-center gap-1.5 text-xs text-gray-500"><User className="w-3.5 h-3.5" /> {ticket.user}</span>
                       <span className="flex items-center gap-1.5 text-xs text-gray-500"><Clock className="w-3.5 h-3.5" /> {new Date(ticket.createdAt).toLocaleString("de-DE")}</span>
                    </div>
                  </div>
                  <div className="flex lg:flex-col justify-between items-end gap-3">
                    <StatusBadge status={ticket.status} />
                    <div className="flex gap-2">
                      {ticket.status !== "CLOSED" && (
                        <button 
                          onClick={() => updateStatus(ticket.id, "CLOSED")}
                          className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors"
                          title="Lösen"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        className="p-2 bg-[#022c22] border border-[#064e3b] text-white rounded-lg hover:border-[#c5a059]/50 transition-all flex items-center gap-2 text-xs font-bold"
                        onClick={() => window.location.href = `/admin/support/${ticket.id}`}
                      >
                         Antworten <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center flex flex-col items-center">
               <Inbox className="w-12 h-12 text-gray-600 mb-4" />
               <h3 className="text-lg font-bold text-white mb-1">Keine Tickets gefunden</h3>
               <p className="text-gray-400">Es liegen aktuell keine Anfragen in dieser Kategorie vor.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
