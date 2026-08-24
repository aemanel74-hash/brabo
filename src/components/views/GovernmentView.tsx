import React, { useState } from 'react';
import { useVillageData } from '../../context/VillageDataContext';
import { VerificationBadge } from '../common/VerificationBadge';
import { SmartImage } from '../common/SmartImage';
import { 
  Users, 
  Award, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  UserCheck, 
  FileCheck,
  Building,
  User,
  ShieldCheck,
  Phone,
  Mail,
  HeartHandshake,
  Flame,
  PlusCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { CommunityOrgMember } from '../../types';

interface GovernmentViewProps {
  onOpenSource: (sourceId: string) => void;
}

type GovTab = 'pemerintah' | 'pkk' | 'karang_taruna';

export const GovernmentView: React.FC<GovernmentViewProps> = ({ onOpenSource }) => {
  const { villageHead, officials, pkkMembers, karangTarunaMembers } = useVillageData();
  const [activeTab, setActiveTab] = useState<GovTab>('pemerintah');

  const kaurList = officials.filter(o => o.role.toLowerCase().includes('kaur') || o.role.toLowerCase().includes('urusan'));
  const kasiList = officials.filter(o => o.role.toLowerCase().includes('kasi') || o.role.toLowerCase().includes('seksi'));
  const kadusList = officials.filter(o => o.role.toLowerCase().includes('kadus') || o.role.toLowerCase().includes('dusun'));
  const sekdes = officials.find(o => o.role.toLowerCase().includes('sekretaris'));
  const otherOfficials = officials.filter(
    o => !kaurList.includes(o) && !kasiList.includes(o) && !kadusList.includes(o) && o !== sekdes
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 border border-emerald-700">
              Pemerintahan & Kelembagaan Desa
            </span>
            <VerificationBadge status="VERIFIED" sourceId="SRC-PELANTIKAN-KADES" onOpenSource={onOpenSource} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Struktur Kelembagaan Desa Brabo
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Struktur kepemimpinan Pemerintah Desa, Tim Penggerak PKK (Pemberdayaan Kesejahteraan Keluarga), dan Karang Taruna pemuda desa terkelola secara transparan dan dinamis.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200 w-fit max-w-full">
        <button
          onClick={() => setActiveTab('pemerintah')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'pemerintah'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-700 hover:bg-white/70'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Pemerintah Desa (Kades & Pamong)</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'pemerintah' ? 'bg-emerald-950 text-emerald-200' : 'bg-slate-200 text-slate-700'}`}>
            {officials.length + 1}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('pkk')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'pkk'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-700 hover:bg-white/70'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>TP PKK Desa Brabo</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'pkk' ? 'bg-emerald-950 text-emerald-200' : 'bg-slate-200 text-slate-700'}`}>
            {pkkMembers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('karang_taruna')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'karang_taruna'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-700 hover:bg-white/70'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Karang Taruna Desa</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'karang_taruna' ? 'bg-emerald-950 text-emerald-200' : 'bg-slate-200 text-slate-700'}`}>
            {karangTarunaMembers.length}
          </span>
        </button>
      </div>

      {/* TAB 1: PEMERINTAH DESA */}
      {activeTab === 'pemerintah' && (
        <div className="space-y-10">
          {/* Verification Notice */}
          {officials.filter(o => o.status === 'VERIFIED').length === officials.length ? (
            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-emerald-950">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-emerald-950">Status Verifikasi Pamong Desa Terkini:</p>
                  <p className="text-emerald-800 leading-relaxed">
                    Kepala Desa (<strong>{villageHead.name}</strong>) beserta seluruh {officials.length} Perangkat & Pamong Desa Brabo telah <strong>terverifikasi resmi</strong> berdasarkan arsip SOTK Pemerintah Desa / Data BPS dan tersinkronisasi secara real-time dari Admin CMS.
                  </p>
                </div>
              </div>
              <VerificationBadge 
                status="VERIFIED" 
                verificationSource="VERIFIED_DESA"
                verificationNote="SOTK Resmi Pemerintah Desa Brabo"
                sourceId={villageHead.sourceId || 'SRC-PELANTIKAN-KADES'} 
                onOpenSource={onOpenSource} 
              />
            </div>
          ) : (
            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-amber-900">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-amber-950">Status Verifikasi Pamong Desa Terkini:</p>
                  <p className="text-amber-800 leading-relaxed">
                    Kepala Desa (<strong>{villageHead.name}</strong>) terverifikasi resmi. Sebanyak {officials.filter(o => o.status === 'VERIFIED').length} dari {officials.length} perangkat desa telah terverifikasi. Pengelola dapat memperbarui status verifikasi secara langsung di Admin CMS.
                  </p>
                </div>
              </div>
              <VerificationBadge 
                status="VERIFIED" 
                verificationSource="VERIFIED_DESA"
                sourceId={villageHead.sourceId || 'SRC-PELANTIKAN-KADES'} 
                onOpenSource={onOpenSource} 
              />
            </div>
          )}

          {/* Head of Village Featured Profile */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Kepala Desa Brabo Definitif</h2>
              </div>
              <VerificationBadge
                status={villageHead.status}
                verificationSource={villageHead.verificationSource}
                verificationNote={villageHead.verificationNote}
                customSourceName={villageHead.customSourceName}
                sourceId={villageHead.sourceId}
                onOpenSource={onOpenSource}
                showSourceTitle={true}
              />
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {villageHead.photoUrl ? (
                <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg border-4 border-emerald-100 shrink-0">
                  <SmartImage src={villageHead.photoUrl} alt={villageHead.name} className="w-full h-full object-cover" width={180} height={180} />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 flex flex-col items-center justify-center text-white shadow-lg shadow-emerald-900/10 shrink-0 border-4 border-emerald-100">
                  <UserCheck className="w-12 h-12 text-emerald-100 mb-1" />
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-900/70 px-2 py-0.5 rounded">
                    KADES
                  </span>
                </div>
              )}

              <div className="space-y-3 text-center md:text-left flex-1">
                <div>
                  <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 mb-1">
                    Pimpinan Pemerintahan Desa
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900">{villageHead.name}</h3>
                  <p className="text-sm font-medium text-emerald-700">{villageHead.role}</p>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-slate-600 justify-center md:justify-start">
                  <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Masa Jabatan: <strong>{villageHead.period || '2019 - Sekarang'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <FileCheck className="w-4 h-4 text-slate-400" />
                    <span>Tanggal Pelantikan: <strong>{villageHead.appointmentDate || '18 Desember 2019'}</strong></span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {villageHead.description || 'Memimpin penyelenggaraan pemerintahan desa, pembinaan kemasyarakatan, pembangunan infrastruktur, dan pemberdayaan masyarakat Desa Brabo.'}
                </p>
              </div>
            </div>
          </div>

          {/* SOTK Hierarchy Chart */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-6 h-6 text-emerald-600" />
                  <span>Bagan Struktur Organisasi dan Tata Kerja (SOTK)</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Mengacu pada UU Desa No. 6 Tahun 2014 & Permendagri No. 84 Tahun 2015.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg w-fit">
                Pola Struktur 3 Dusun
              </span>
            </div>

            {/* Visual Org Hierarchy Tree */}
            <div className="flex flex-col items-center space-y-8 w-full max-w-full">
              {/* Level 1: Kepala Desa */}
              <div className="w-full max-w-md">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white text-center shadow-lg shadow-emerald-950/20 border-2 border-emerald-500 space-y-3">
                  <span className="inline-block text-[10px] uppercase font-bold tracking-widest bg-emerald-800 text-emerald-200 px-3 py-1 rounded-full border border-emerald-600/60">
                    Pimpinan Pemerintahan Desa
                  </span>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-1">
                    {villageHead.photoUrl ? (
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md border-2 border-emerald-400 shrink-0">
                        <SmartImage src={villageHead.photoUrl} alt={villageHead.name} className="w-full h-full object-cover" width={96} height={96} />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-black text-sm shrink-0 border-2 border-emerald-500">
                        KADES
                      </div>
                    )}
                    <div className="text-center sm:text-left min-w-0">
                      <h4 className="text-base font-extrabold text-white leading-snug break-words">{villageHead.name}</h4>
                      <p className="text-xs text-emerald-300 font-medium">{villageHead.role}</p>
                      <p className="text-[10px] text-emerald-400/90 font-mono mt-0.5">{villageHead.period || '2019 - Sekarang'}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-800/60 flex justify-center">
                    <VerificationBadge
                      status={villageHead.status}
                      verificationSource={villageHead.verificationSource}
                      verificationNote={villageHead.verificationNote}
                      customSourceName={villageHead.customSourceName}
                      sourceId={villageHead.sourceId}
                      onOpenSource={onOpenSource}
                    />
                  </div>
                </div>
              </div>

              <div className="w-0.5 h-6 bg-slate-300 -my-4" />

              {/* Level 2: Sekretaris Desa */}
              {sekdes && (
                <div className="w-full max-w-md">
                  <div className="p-5 rounded-2xl bg-slate-900 text-white text-center shadow-md border-2 border-slate-700 space-y-3">
                    <span className="inline-block text-[10px] uppercase font-bold tracking-widest bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-600/60">
                      Pimpinan Sekretariat
                    </span>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-1">
                      {sekdes.photoUrl ? (
                        <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md border-2 border-slate-500 shrink-0">
                          <SmartImage src={sekdes.photoUrl} alt={sekdes.name} className="w-full h-full object-cover" width={80} height={80} />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-600">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                      <div className="text-center sm:text-left min-w-0">
                        <h4 className="text-sm font-extrabold text-white leading-snug break-words">{sekdes.name}</h4>
                        <p className="text-xs text-slate-300 font-medium">{sekdes.role}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{sekdes.period || 'Definitif'}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex justify-center">
                      <VerificationBadge
                        status={sekdes.status}
                        verificationSource={sekdes.verificationSource}
                        verificationNote={sekdes.verificationNote}
                        customSourceName={sekdes.customSourceName}
                        sourceId={sekdes.sourceId}
                        onOpenSource={onOpenSource}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Level 3: KAUR & KASI */}
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                {/* Urusan (Kaur) */}
                <div className="space-y-3 bg-slate-50/80 p-5 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <Building className="w-4 h-4 text-emerald-700 shrink-0" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Kepala Urusan (KAUR) Sekretariat
                    </h4>
                  </div>
                  <div className="space-y-2.5">
                    {kaurList.map((kaur) => (
                      <div key={kaur.id} className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-300 transition-all">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {kaur.photoUrl ? (
                            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-2xs border border-slate-200 shrink-0 bg-slate-100">
                              <SmartImage src={kaur.photoUrl} alt={kaur.name} className="w-full h-full object-cover" width={64} height={64} />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-100">
                              <User className="w-5 h-5 text-emerald-600" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-900 leading-snug break-words">{kaur.name}</p>
                            <p className="text-[11px] text-emerald-700 font-semibold leading-snug break-words">{kaur.role}</p>
                            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{kaur.period || 'Perangkat Desa'}</span>
                          </div>
                        </div>
                        <div className="self-start sm:self-center shrink-0">
                          <VerificationBadge
                            status={kaur.status}
                            verificationSource={kaur.verificationSource}
                            verificationNote={kaur.verificationNote}
                            customSourceName={kaur.customSourceName}
                            sourceId={kaur.sourceId}
                            onOpenSource={onOpenSource}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seksi (Kasi) */}
                <div className="space-y-3 bg-slate-50/80 p-5 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <Users className="w-4 h-4 text-emerald-700 shrink-0" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Kepala Seksi (KASI) Pelaksana Teknis
                    </h4>
                  </div>
                  <div className="space-y-2.5">
                    {kasiList.map((kasi) => (
                      <div key={kasi.id} className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-300 transition-all">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {kasi.photoUrl ? (
                            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-2xs border border-slate-200 shrink-0 bg-slate-100">
                              <SmartImage src={kasi.photoUrl} alt={kasi.name} className="w-full h-full object-cover" width={64} height={64} />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0 border border-teal-100">
                              <User className="w-5 h-5 text-teal-600" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-900 leading-snug break-words">{kasi.name}</p>
                            <p className="text-[11px] text-emerald-700 font-semibold leading-snug break-words">{kasi.role}</p>
                            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{kasi.period || 'Perangkat Desa'}</span>
                          </div>
                        </div>
                        <div className="self-start sm:self-center shrink-0">
                          <VerificationBadge
                            status={kasi.status}
                            verificationSource={kasi.verificationSource}
                            verificationNote={kasi.verificationNote}
                            customSourceName={kasi.customSourceName}
                            sourceId={kasi.sourceId}
                            onOpenSource={onOpenSource}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Level 4: Pelaksana Kewilayahan (Kepala Dusun) */}
              <div className="w-full space-y-3 bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200">
                <div className="flex items-center gap-2 pb-2 border-b border-emerald-200/80">
                  <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                    Pelaksana Kewilayahan (Kepala Dusun / Kadus)
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {kadusList.map((kadus) => (
                    <div key={kadus.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between gap-3 hover:border-emerald-300 transition-all">
                      <div className="flex items-start gap-3 min-w-0">
                        {kadus.photoUrl ? (
                          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-2xs border border-slate-200 shrink-0 bg-slate-100">
                            <SmartImage src={kadus.photoUrl} alt={kadus.name} className="w-full h-full object-cover" width={64} height={64} />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-100">
                            <User className="w-5 h-5 text-emerald-700" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 leading-snug break-words">{kadus.name}</p>
                          <p className="text-[11px] text-emerald-800 font-semibold leading-snug break-words">{kadus.role}</p>
                          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Masa: {kadus.period || 'Definitif'}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[10px] text-emerald-700 font-medium">Pelaksana Wilayah</span>
                        <VerificationBadge
                          status={kadus.status}
                          verificationSource={kadus.verificationSource}
                          verificationNote={kadus.verificationNote}
                          customSourceName={kadus.customSourceName}
                          sourceId={kadus.sourceId}
                          onOpenSource={onOpenSource}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Complete Officials Directory Grid */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Daftar Pamong & Perangkat Desa Brabo
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Total {officials.length + 1} perangkat desa terdaftar dalam sistem administrasi.
                </p>
              </div>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full w-fit">
                Kependudukan Resmi
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Kades Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950 to-slate-900 text-white border border-emerald-700/60 shadow-md flex flex-col justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  {villageHead.photoUrl ? (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-md border-2 border-emerald-400 shrink-0 bg-emerald-900">
                      <SmartImage src={villageHead.photoUrl} alt={villageHead.name} className="w-full h-full object-cover" width={96} height={96} />
                    </div>
                  ) : (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-black text-sm shrink-0 border-2 border-emerald-500">
                      KADES
                    </div>
                  )}
                  <div className="min-w-0 flex-1 space-y-1">
                    <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-800/90 text-emerald-200 border border-emerald-600/50 uppercase tracking-wide">
                      Kepala Desa
                    </span>
                    <h4 className="text-sm font-extrabold text-white leading-snug break-words">{villageHead.name}</h4>
                    <p className="text-xs text-emerald-300 font-medium leading-snug break-words">{villageHead.role}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-emerald-800/60 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-200">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{villageHead.period || '2019 - Sekarang'}</span>
                  </div>
                  <VerificationBadge
                    status={villageHead.status}
                    verificationSource={villageHead.verificationSource}
                    verificationNote={villageHead.verificationNote}
                    customSourceName={villageHead.customSourceName}
                    sourceId={villageHead.sourceId}
                    onOpenSource={onOpenSource}
                  />
                </div>
              </div>

              {/* All Officials Cards */}
              {officials.map((official) => (
                <div 
                  key={official.id} 
                  className="p-4 sm:p-5 rounded-2xl bg-white hover:bg-slate-50/90 border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-emerald-300 transition-all flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    {official.photoUrl ? (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-xs border border-slate-200 shrink-0 bg-slate-100">
                        <SmartImage src={official.photoUrl} alt={official.name} className="w-full h-full object-cover" width={96} height={96} />
                      </div>
                    ) : (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200">
                        <User className="w-6 h-6 sm:w-7 sm:h-7 text-slate-400" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1 space-y-1">
                      <h4 className="text-sm font-bold text-slate-900 leading-snug break-words">{official.name}</h4>
                      <p className="text-xs text-emerald-800 font-semibold leading-snug break-words">{official.role}</p>
                      {official.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{official.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{official.period || 'Perangkat Desa'}</span>
                    </div>
                    <VerificationBadge
                      status={official.status}
                      verificationSource={official.verificationSource}
                      verificationNote={official.verificationNote}
                      customSourceName={official.customSourceName}
                      sourceId={official.sourceId}
                      onOpenSource={onOpenSource}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TIM PENGGERAK PKK */}
      {activeTab === 'pkk' && (
        <div className="space-y-8">
          {/* Intro Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Tim Penggerak Pemberdayaan & Kesejahteraan Keluarga (TP PKK)
                  </h2>
                  <p className="text-xs text-slate-500">Lembaga Kemasyarakatan Desa (LKD) Desa Brabo</p>
                </div>
              </div>
              <span className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl w-fit">
                10 Program Pokok PKK
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              TP PKK Desa Brabo berperan aktif sebagai mitra strategis Pemerintah Desa dalam meningkatkan kesejahteraan keluarga, posyandu balita & lansia, ketahanan pangan pekarangan, serta pembinaan ekonomi keluarga.
            </p>
          </div>

          {/* Members Content or Clean Empty State */}
          {pkkMembers.length === 0 ? (
            <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border-2 border-dashed border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center shadow-xs">
                <HeartHandshake className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-bold text-slate-800">
                  Data Struktur Pengurus PKK Belum Diinput
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Susunan pengurus TP PKK Desa Brabo (Ketua, Sekretaris, Bendahara, dan Pokja I-IV) disiapkan kosongan tanpa data tiruan. Administrator Desa dapat menambahkan informasi pengurus resmi melalui Pusat Kendali Admin CMS.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-900 text-xs font-semibold px-4 py-2 rounded-xl border border-emerald-200">
                <Info className="w-4 h-4 text-emerald-600" />
                <span>Siap diisi oleh Admin Desa di menu Dashboard Admin &gt; Kelembagaan</span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-slate-900">
                  Susunan Pengurus TP PKK Desa Brabo
                </h3>
                <span className="text-xs text-slate-500">
                  Total {pkkMembers.length} Pengurus
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pkkMembers.map((member) => (
                  <div 
                    key={member.id} 
                    className="p-4 sm:p-5 rounded-2xl bg-white hover:bg-slate-50/90 border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-emerald-300 transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      {member.photoUrl ? (
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-xs border border-slate-200 shrink-0 bg-slate-100">
                          <SmartImage src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" width={96} height={96} />
                        </div>
                      ) : (
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-center font-bold text-xs shrink-0 border border-rose-100">
                          <User className="w-6 h-6 sm:w-7 sm:h-7 text-rose-500" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1 space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200/60 uppercase tracking-wide">
                          {member.position}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug break-words">{member.name}</h4>
                        {member.contact && (
                          <p className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{member.contact}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{member.period || 'Pengurus PKK'}</span>
                      </div>
                      <VerificationBadge
                        status={member.status}
                        verificationSource={member.verificationSource}
                        verificationNote={member.verificationNote}
                        customSourceName={member.customSourceName}
                        sourceId={member.sourceId}
                        onOpenSource={onOpenSource}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: KARANG TARUNA */}
      {activeTab === 'karang_taruna' && (
        <div className="space-y-8">
          {/* Intro Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Karang Taruna Desa Brabo
                  </h2>
                  <p className="text-xs text-slate-500">Wadah Pengembangan Generasi Muda & Kepemudaan Desa</p>
                </div>
              </div>
              <span className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl w-fit">
                Lembaga Kemasyarakatan Desa (LKD)
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Karang Taruna Desa Brabo berfokus pada pembinaan kepemudaan, gotong royong sosial, olahraga, kesenian, dan pemberdayaan ekonomi kreatif bagi pemuda di Dusun Dukoh, Dusun Krajan, dan Dusun Cangkring.
            </p>
          </div>

          {/* Members Content or Clean Empty State */}
          {karangTarunaMembers.length === 0 ? (
            <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border-2 border-dashed border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center shadow-xs">
                <Flame className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-bold text-slate-800">
                  Data Struktur Pengurus Karang Taruna Belum Diinput
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Susunan pengurus Karang Taruna Desa Brabo (Ketua, Wakil, Sekretaris, Bendahara, dan Seksi Bidang) disiapkan dalam format kosongan tanpa data tiruan. Administrator Desa dapat mengisi data resmi melalui Pusat Kendali Admin CMS.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-900 text-xs font-semibold px-4 py-2 rounded-xl border border-emerald-200">
                <Info className="w-4 h-4 text-emerald-600" />
                <span>Siap diisi oleh Admin Desa di menu Dashboard Admin &gt; Kelembagaan</span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-slate-900">
                  Susunan Pengurus Karang Taruna Desa Brabo
                </h3>
                <span className="text-xs text-slate-500">
                  Total {karangTarunaMembers.length} Pengurus
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {karangTarunaMembers.map((member) => (
                  <div 
                    key={member.id} 
                    className="p-4 sm:p-5 rounded-2xl bg-white hover:bg-slate-50/90 border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-emerald-300 transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      {member.photoUrl ? (
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-xs border border-slate-200 shrink-0 bg-slate-100">
                          <SmartImage src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" width={96} height={96} />
                        </div>
                      ) : (
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-100">
                          <User className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1 space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200/60 uppercase tracking-wide">
                          {member.position}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug break-words">{member.name}</h4>
                        {member.contact && (
                          <p className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{member.contact}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{member.period || 'Pengurus Karang Taruna'}</span>
                      </div>
                      <VerificationBadge
                        status={member.status}
                        verificationSource={member.verificationSource}
                        verificationNote={member.verificationNote}
                        customSourceName={member.customSourceName}
                        sourceId={member.sourceId}
                        onOpenSource={onOpenSource}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

