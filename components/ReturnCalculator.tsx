"use client";

import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ReturnCalculator() {
  const [investment, setInvestment] = useState<number>(10000);

  const data = useMemo(() => {
    // 4.8% Ijarah (Rental yield)
    const result = [];
    let cumulativeMiete = 0;
    let currentCapital = investment;
    
    for (let year = 0; year <= 10; year++) {
      if (year === 0) {
        result.push({ 
          year: "0", 
          Investment: investment,
          Ertrag: 0
        });
      } else {
        const rentalYield = investment * 0.048; // Rendite bezieht sich auf Initialinvestment
        cumulativeMiete += rentalYield;
        
        result.push({
          year: `${year}`,
          Investment: investment,
          Ertrag: Math.round(cumulativeMiete)
        });
      }
    }
    return result;
  }, [investment]);

  const finaleSumme = data[10].Investment + data[10].Ertrag;
  const gesamtGewinn = finaleSumme - investment;

  return (
    <div className="w-full bg-white dark:bg-[#03362a] rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 dark:border-brand-emerald/20 mt-8 relative overflow-hidden">
      {/* Subtle gold glow behind calculator */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        
        {/* Controls Section */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Ihr Halal-Vermögensaufbau
          </h3>
          <p className="text-gray-500 dark:text-gray-300 mb-8 max-w-sm">
            Berechnen Sie Ihre erwartete Rendite durch Mieteinnahmen (Ijarah) und Wertsteigerung über 10 Jahre.
          </p>

          <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
              <label htmlFor="investment-slider" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Wie viel möchten Sie investieren?
              </label>
              <span className="text-2xl font-bold text-brand-emerald dark:text-brand-gold">
                {new Intl.NumberFormat('de-DE').format(investment)} €
              </span>
            </div>
            <input
              id="investment-slider"
              type="range"
              min="1000"
              max="100000"
              step="1000"
              value={investment}
              onChange={(e) => setInvestment(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-brand-emerald/30 rounded-lg appearance-none cursor-pointer accent-brand-gold"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>1.000 €</span>
              <span>100.000 €</span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-[#022c22] rounded-xl p-5 border border-gray-100 dark:border-brand-emerald/30">
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">Ergebnis nach 10 Jahren</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Initiales Investment</span>
                <span className="font-medium dark:text-white">{new Intl.NumberFormat('de-DE').format(investment)} €</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Netto-Mietertrag (Ijarah)</span>
                <span className="font-medium text-green-600 dark:text-green-400">+{new Intl.NumberFormat('de-DE').format(data[10].Ertrag)} €</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-300">Jährliche Mietrendite (Ijarah)</span>
                <span className="font-medium text-brand-gold dark:text-brand-gold-light">4,8 %</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="font-bold text-gray-900 dark:text-white text-lg">Gesamtvermögen</span>
                <span className="font-bold text-brand-dark dark:text-white text-xl">{new Intl.NumberFormat('de-DE').format(finaleSumme)} €</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="lg:col-span-7 h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c5a059" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#c5a059" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorErtrag" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#064e3b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#064e3b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
              <XAxis 
                dataKey="year" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: '#6B7280'}}
                tickFormatter={(value) => `J ${value}`}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: '#6B7280'}}
                tickFormatter={(value) => `${value / 1000}k`}
                width={40}
              />
              <Tooltip 
                formatter={(value: any) => [`${new Intl.NumberFormat('de-DE').format(Number(value))} €`, '']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelFormatter={(label) => `Jahr ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="Investment" 
                stackId="1" 
                stroke="#c5a059" 
                strokeWidth={3}
                fill="url(#colorInvestment)" 
                name="Immobilienwert"
              />
              <Area 
                type="monotone" 
                dataKey="Ertrag" 
                stackId="1" 
                stroke="#064e3b" 
                strokeWidth={3}
                fill="url(#colorErtrag)" 
                name="Kumulierte Miete"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
      </div>
    </div>
  );
}
