import React from 'react';
import { VILLAGE_BUDGET_SAMPLE } from '../../data/research/transparency';
import { VerificationBadge } from '../common/VerificationBadge';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  Coins, 
  FileCheck, 
  AlertCircle, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2,
  Lock,
  Landmark
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface TransparencyViewProps {
  onOpenSource: (sourceId: string) => void;
}

const INCOME_COLORS = ['#10b981', '#06b6d4', '#3b82f6', '#f59e0b'];
const EXPENSE_COLORS = ['#ef4444', '#f97316', '#8b5cf6', '#06b6d4'];

export const TransparencyView: React.FC<TransparencyViewProps> = ({ onOpenSource }) => {
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 border border-emerald-700">
              Transparansi Keuangan Desa
            </span>
            <VerificationBadge status="REQUIRES_VERIFICATION" sourceId="SRC-KKN-UNVERIFIED" onOpenSource={onOpenSource} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Transparansi APBDes & Audit KKN
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Menyajikan prinsip keterbukaan alokasi Dana Desa (APBN), ADD (Kabupaten), PADes, serta realisasi belanja pembangunan jalan lingkungan, talud persawahan, posyandu, dan bantuan sosial warga.
          </p>
        </div>
      </div>

      {/* Verification Notice */}
      <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 flex items-start gap-3.5 text-xs text-amber-900">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-950">Status Data APBDes Desa Brabo:</p>
          <p className="leading-relaxed">
            Struktur APBDes di bawah merupakan format standar visualisasi sistem keterbukaan informasi desa. Rincian angka realisasi definitif tahun berjalan disinkronkan secara berkala sesuai Peraturan Desa (Perdes) APBDes yang disahkan oleh BPD Desa Brabo.
          </p>
        </div>
      </div>

      {/* Summary Totals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-200/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-700">
            <span>Estimasi Pendapatan Desa (APBDes)</span>
            <Coins className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-emerald-950">
            {formatRupiah(VILLAGE_BUDGET_SAMPLE.totalIncome)}
          </p>
          <p className="text-xs text-slate-500">
            Didominasi Dana Desa (APBN 53%) dan Alokasi Dana Desa (ADD Pemkab 33%).
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
            <span>Estimasi Belanja & Pembangunan Desa</span>
            <Landmark className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-slate-900">
            {formatRupiah(VILLAGE_BUDGET_SAMPLE.totalExpenditure)}
          </p>
          <p className="text-xs text-slate-500">
            Prioritas: Pembangunan infrastruktur rabat beton 3 dusun & posyandu.
          </p>
        </div>
      </div>

      {/* Recharts Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Income Breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-600" />
              <span>Komposisi Sumber Pendapatan</span>
            </h3>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Total 100%
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={VILLAGE_BUDGET_SAMPLE.incomeCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="percentage"
                  nameKey="title"
                >
                  {VILLAGE_BUDGET_SAMPLE.incomeCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={INCOME_COLORS[index % INCOME_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}%`, 'Persentase']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            {VILLAGE_BUDGET_SAMPLE.incomeCategories.map((cat, idx) => (
              <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: INCOME_COLORS[idx % INCOME_COLORS.length] }} />
                  <span className="font-semibold text-slate-800">{cat.title}</span>
                </div>
                <span className="font-mono font-bold text-emerald-800">{formatRupiah(cat.amount)} ({cat.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expenditure Breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-600" />
              <span>Alokasi Bidang Belanja Desa</span>
            </h3>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
              Prioritas Pembangunan
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VILLAGE_BUDGET_SAMPLE.expenditureCategories} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" unit="%" />
                <YAxis type="category" dataKey="title" width={120} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value: number) => [`${value}%`, 'Proporsi Anggaran']} />
                <Bar dataKey="percentage" fill="#0d9488" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            {VILLAGE_BUDGET_SAMPLE.expenditureCategories.map((cat, idx) => (
              <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-800">{cat.title}</span>
                <span className="font-mono font-bold text-teal-800">{formatRupiah(cat.amount)} ({cat.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
