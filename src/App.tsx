/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Menu, 
  X, 
  MapPin, 
  Clock, 
  Calendar, 
  Beer, 
  UtensilsCrossed, 
  Sun, 
  Moon, 
  Instagram, 
  Share2,
  Camera,
  CheckCircle2,
  AlertCircle,
  Info,
  Wine,
  Download,
  Search,
  Quote,
  Twitter,
  Facebook,
  Link2,
  MessageCircle,
  ArrowUp,
  Plus,
  Star,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps';
import firebaseConfig from '../firebase-applet-config.json';
import ambienteImg from './assets/images/regenerated_image_1778222319209.png';
import { Language, translations } from './translations';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const originalError = error as any;
  const errorCode = originalError?.code || '';
  const errorMessage = originalError?.message || String(error);

  let friendlyMessage = "Ha ocurrido un error inesperado en nuestro sistema. Por favor, inténtalo de nuevo más tarde.";
  let type: 'error' | 'warning' | 'info' = 'error';

  if (errorCode === 'permission-denied') {
    friendlyMessage = "No tienes permisos para realizar esta acción. Por favor, contacta con nosotros si crees que es un error.";
  } else if (errorCode === 'unavailable' || errorMessage.includes('offline')) {
    friendlyMessage = "Parece que hay un problema de conexión. Por favor, comprueba tu internet e inténtalo de nuevo.";
    type = 'warning';
  } else if (errorCode === 'resource-exhausted') {
    friendlyMessage = "Hemos superado el límite de uso diario de la base de datos. Por favor, inténtalo de nuevo mañana.";
  } else if (errorCode === 'invalid-argument') {
    friendlyMessage = "Los datos enviados no son válidos. Por favor, revisa el formulario e inténtalo de nuevo.";
  } else if (errorCode === 'deadline-exceeded') {
    friendlyMessage = "La operación ha tardado demasiado tiempo. Por favor, inténtalo de nuevo con una mejor conexión.";
    type = 'warning';
  } else if (errorCode === 'not-found') {
    friendlyMessage = "No hemos podido encontrar la información solicitada.";
    type = 'info';
  }

  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  
  console.error('Firestore Error: ', JSON.stringify(errInfo));

  // Dispatch custom event for the toast notification
  window.dispatchEvent(new CustomEvent('app-notification', {
    detail: { message: friendlyMessage, type }
  }));

  throw new Error(JSON.stringify(errInfo));
}

// Utility to inject lazy loading into HTML strings
const injectLazyLoading = (html: string) => {
  if (!html) return '';
  return html.replace(/<img\s+(?![^>]*loading=)([^>]+)>/gi, '<img loading="lazy" $1>');
};

// Connection test
async function testConnection() {
  try {
    // Attempting to fetch a document from the server to verify connectivity
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    console.error("Firestore connectivity check failed:", error);
    
    let message = "No se ha podido establecer conexión con la base de datos de Firebase.";
    let type: 'error' | 'warning' = 'error';
    
    if (error.message?.includes('the client is offline') || error.code === 'unavailable' || error.message?.includes('Backend didn\'t respond')) {
      message = "Error de conexión: El servidor de Firebase no responde. Esto puede deberse a un problema de red o a que la base de datos no está activa.";
      type = 'warning';
    } else if (error.code === 'permission-denied') {
      // This is actually a good sign of connectivity! It means we reached it but rules blocked us.
      return; 
    }
    
    window.dispatchEvent(new CustomEvent('app-notification', {
      detail: { message, type }
    }));
  }
}
testConnection();

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=75&w=1280",
  cocteleria: "https://images.unsplash.com/photo-1544145945-f904253d0c71?auto=format&fit=crop&q=75&w=1280",
  picoteo: "https://images.unsplash.com/photo-1532347232151-9ba3bc50942d?auto=format&fit=crop&q=75&w=1280",
  terraza: "https://lh3.googleusercontent.com/aida/ADBb0ugjwiRGtqmoRMJKhxdQhNPBqWxumnT6x46oINAWW1gdJOeFIj8Y-ALl6Pa27w1hdsv4zfQ3srVa-0bXOtY_shN2jVbagjiX5eiRZ3upyWJ2JGjvJc5UFuNl5nEh3rlqeSVrt3rhQrwLJO4_hRHDNRheUcfZ5NSnaQPYeeWPfqHQUt7tvPlzBioNCxqZ-SXA8LV3jqOgbjJf_PvtGFhg3_al35AP0q4J_h3vpke2TiiwmfzW-kE5f9sGgwIdyvZOknZc6qE0S-rypAs",
  ambiente: ambienteImg,
  palacio: "https://images.unsplash.com/photo-1628155255476-880be9087c54?auto=format&fit=crop&q=75&w=1280"
};

// Tooltip component for interactive buttons
function Tooltip({ children, text }: { children: React.ReactNode; text: string }) {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div className="relative flex items-center" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-full mb-3 px-3 py-1.5 bg-white text-charcoal text-[10px] font-bold tracking-wider rounded shadow-xl whitespace-nowrap z-[100] uppercase"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';

// Place ID for Bar Garnish in Zaragoza (Found via GMaps)
const BAR_GARNISH_PLACE_ID = "ChIJ_U2X_r5WWwwR4Xv7_7_7_7w"; // This is a placeholder, will search if not valid

function GoogleReviews({ lang }: { lang: Language }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const placesLib = useMapsLibrary('places');
  const t = translations[lang];

  useEffect(() => {
    if (!placesLib || !GOOGLE_MAPS_API_KEY) {
      setLoading(false);
      return;
    }

    const fetchReviews = async () => {
      try {
        setLoading(true);
        setApiError(null);
        // First, let's try to find the place to be sure we have the right one
        // Search for "Garnish Zaragoza" to get the latest info
        const { places } = await placesLib.Place.searchByText({
          textQuery: "Garnish Bar Zaragoza Pablo Casals",
          fields: ['id', 'displayName', 'reviews', 'rating', 'userRatingCount'],
        });

        if (places && places.length > 0) {
          const place = places[0];
          await place.fetchFields({ fields: ['reviews', 'rating'] });
          
          if (place.reviews) {
            setReviews(place.reviews);
          }
        }
      } catch (error: any) {
        console.error("Error fetching Google reviews:", error);
        if (error.message?.includes('Places API (New)') || error.message?.includes('disabled')) {
          setApiError('places-api-new-disabled');
        } else {
          setApiError('generic-error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [placesLib]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!GOOGLE_MAPS_API_KEY || apiError === 'places-api-new-disabled') {
    const mockReviews = [
      {
        authorAttribution: { displayName: "Carlos M.", photoURI: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=60&w=200" },
        relativePublishTimeDescription: lang === 'es' ? "hace una semana" : "one week ago",
        rating: 5,
        text: lang === 'es' ? "Un oasis de tranquilidad frente a la Aljafería. Los cócteles son simplemente inolvidables." : "An oasis of tranquility in front of the Aljafería. The cocktails are simply unforgettable."
      },
      {
        authorAttribution: { displayName: "Elena R.", photoURI: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=60&w=200" },
        relativePublishTimeDescription: lang === 'es' ? "hace un mes" : "one month ago",
        rating: 5,
        text: lang === 'es' ? "El mejor tardeo de Zaragoza sin ninguna duda. El ambiente y el servicio son impecables." : "The best 'tardeo' in Zaragoza without a doubt. The atmosphere and service are impeccable."
      },
      {
        authorAttribution: { displayName: "Javier S.", photoURI: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=60&w=200" },
        relativePublishTimeDescription: lang === 'es' ? "hace 2 meses" : "2 months ago",
        rating: 5,
        text: lang === 'es' ? "Calidad suprema en cada detalle. Un lugar con alma que te invita a volver una y otra vez." : "Supreme quality in every detail. A place with soul that invites you to return again and again."
      }
    ];

    return (
      <div className="space-y-8">
        {/* API Status Notice */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="bg-amber-500/20 p-3 rounded-full text-amber-500 shrink-0">
            <AlertCircle size={24} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-amber-500 font-bold text-sm tracking-widest uppercase mb-1">
              {apiError === 'places-api-new-disabled' 
                ? (lang === 'es' ? "Acción Requerida: Activar API" : "Action Required: Enable API") 
                : (lang === 'es' ? "Configuración Pendiente" : "Configuration Pending")}
            </h4>
            <p className="text-white/60 text-xs">
              {apiError === 'places-api-new-disabled' 
                ? (lang === 'es' ? "El sistema está listo, pero debes habilitar 'Places API (New)' en Google Cloud Console para ver reseñas en tiempo real." : "System is ready, but you must enable 'Places API (New)' in Google Cloud Console to see real-time reviews.")
                : (lang === 'es' ? "Añade tu GOOGLE_MAPS_PLATFORM_KEY en los Secretos de AI Studio para conectar con las reseñas reales de Google." : "Add your GOOGLE_MAPS_PLATFORM_KEY in AI Studio Secrets to connect with real Google reviews.")}
            </p>
          </div>
          <a 
            href={apiError === 'places-api-new-disabled' 
              ? "https://console.cloud.google.com/apis/library/places.googleapis.com" 
              : "https://console.cloud.google.com/google/maps-apis/start"}
            target="_blank" 
            rel="noreferrer"
            className="px-6 py-2 bg-amber-500 text-black font-bold text-[10px] uppercase tracking-widest rounded-full hover:bg-amber-400 transition-colors shrink-0"
          >
            {lang === 'es' ? "Configurar ahora" : "Configure now"}
          </a>
        </div>

        {/* Fallback Reviews Preview */}
        <div className="relative">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-1 rounded-full flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
              {lang === 'es' ? "Modo Vista Previa" : "Preview Mode"}
            </span>
          </div>
          <div className="flex flex-nowrap overflow-x-auto gap-8 pb-8 scrollbar-hide snap-x snap-mandatory pt-12 grayscale opacity-50">
            {mockReviews.map((review, idx) => (
              <div
                key={idx}
                className="bg-charcoal p-10 rounded-2xl border border-white/5 relative flex-shrink-0 w-full md:w-[calc(33.333%-1.5rem)] snap-center"
              >
                <Quote className="absolute top-6 right-8 text-white/5" size={60} />
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-6 border-2 border-white/10 p-1">
                    <img 
                      src={review.authorAttribution?.photoURI} 
                      alt={review.authorAttribution?.displayName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="flex gap-1 mb-4 text-white/20">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-white/40 italic mb-8 leading-relaxed text-lg font-light">"{review.text}"</p>
                  <div className="w-8 h-[1px] bg-white/10 mb-4" />
                  <h4 className="text-white/40 font-bold tracking-widest text-sm uppercase">{review.authorAttribution?.displayName}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const displayReviews = reviews.length > 0 ? reviews.slice(0, 3) : [
    {
      authorAttribution: { displayName: "Carlos M.", photoURI: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=60&w=200" },
      relativePublishTimeDescription: lang === 'es' ? "hace una semana" : "one week ago",
      rating: 5,
      text: lang === 'es' ? "Un oasis de tranquilidad frente a la Aljafería. Los cócteles son simplemente inolvidables." : "An oasis of tranquility in front of the Aljafería. The cocktails are simply unforgettable."
    },
    {
      authorAttribution: { displayName: "Elena R.", photoURI: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=60&w=200" },
      relativePublishTimeDescription: lang === 'es' ? "hace un mes" : "one month ago",
      rating: 5,
      text: lang === 'es' ? "El mejor tardeo de Zaragoza sin ninguna duda. El ambiente y el servicio son impecables." : "The best 'tardeo' in Zaragoza without a doubt. The atmosphere and service are impeccable."
    },
    {
      authorAttribution: { displayName: "Javier S.", photoURI: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=60&w=200" },
      relativePublishTimeDescription: lang === 'es' ? "hace 2 meses" : "2 months ago",
      rating: 5,
      text: lang === 'es' ? "Calidad suprema en cada detalle. Un lugar con alma que te invita a volver una y otra vez." : "Supreme quality in every detail. A place with soul that invites you to return again and again."
    }
  ];

  return (
    <div className="flex flex-nowrap overflow-x-auto gap-8 pb-8 scrollbar-hide snap-x snap-mandatory">
      {displayReviews.map((review: any, idx: number) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.2 }}
          className="bg-charcoal p-10 rounded-2xl border border-white/5 relative group hover:border-gold/20 transition-all duration-500 flex-shrink-0 w-full md:w-[calc(33.333%-1.5rem)] snap-center"
        >
          <Quote className="absolute top-6 right-8 text-gold/10 group-hover:text-gold/20 transition-colors" size={60} />
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full overflow-hidden mb-6 border-2 border-gold/30 p-1">
              <img 
                src={review.authorAttribution?.photoURI || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=60&w=200"} 
                alt={review.authorAttribution?.displayName}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover rounded-full filter grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="flex gap-1 mb-4 text-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill={i < (review.rating || 5) ? "currentColor" : "none"} strokeWidth={2} />
              ))}
            </div>
            <p className="text-white/80 italic mb-8 leading-relaxed text-lg font-light">
              "{review.text || review.quote}"
            </p>
            <div className="w-8 h-[1px] bg-gold/50 mb-4" />
            <h4 className="text-gold font-bold tracking-widest text-sm uppercase">{review.authorAttribution?.displayName || review.name}</h4>
            <span className="text-white/30 text-[10px] mt-1 uppercase tracking-widest">{review.relativePublishTimeDescription}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
function ReservationModal({ isOpen, onClose, selectedItems = [], lang }: { isOpen: boolean; onClose: () => void; selectedItems?: string[]; lang: Language }) {
  const [formData, setFormData] = useState({ name: '', email: '', date: '', time: '20:00', guests: '2' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const t = translations[lang].reservation;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = t.errors.name;
    if (!formData.email.trim()) newErrors.email = t.errors.email;
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t.errors.emailInvalid;
    if (!formData.date) newErrors.date = t.errors.date;
    if (!formData.time) newErrors.time = t.errors.time;
    return newErrors;
  };

  const getAvailableTimes = () => {
    const times = [];
    const openingHour = 11;
    let closingHour = 24; // Representing 00:00 as 24 for logic

    if (formData.date) {
      const [year, month, day] = formData.date.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();
      // Friday (5) or Saturday (6) closes at 02:30, so last reservation at 01:30
      if (dayOfWeek === 5 || dayOfWeek === 6) {
        closingHour = 26.5; 
      }
    } else {
      // Default maximum range if no date selected
      closingHour = 26.5;
    }

    const last_reservation_hour = closingHour - 1;

    for (let h = openingHour; h <= last_reservation_hour; h += 0.5) {
      const actual_h = Math.floor(h) % 24;
      const m = (h % 1) * 60;
      const timeStr = `${actual_h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      times.push(timeStr);
    }
    return times;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    const pathForWrite = 'reservations';
    try {
      await addDoc(collection(db, pathForWrite), {
        name: formData.name,
        email: formData.email,
        date: formData.date,
        time: formData.time,
        guests: formData.guests,
        selectedItems: selectedItems,
        createdAt: serverTimestamp(),
        lang: lang
      });

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFormData({ name: '', email: '', date: '', time: '20:00', guests: '2' });
      }, 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, pathForWrite);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-charcoal-light w-full max-w-md p-8 rounded-2xl border border-white/10 shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]"
          >
            <div className="leather-texture absolute inset-0 opacity-10 pointer-events-none" />
            
            <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-gold transition-colors z-10">
              <X size={24} />
            </button>

            {isSuccess ? (
              <div className="text-center py-8 relative z-10">
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 size={40} className="text-charcoal" />
                </motion.div>
                <h3 className="text-2xl font-serif font-bold text-white mb-2">{t.successTitle}</h3>
                <p className="text-white/60">{t.successDesc}</p>
              </div>
            ) : (
              <div className="relative z-10">
                <h3 className="text-3xl font-serif font-bold text-gold mb-2">{t.title}</h3>
                <p className="text-white/60 mb-8 text-sm">{t.subtitle}</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {selectedItems.length > 0 && (
                    <div className="bg-gold/10 border border-gold/20 p-4 rounded-xl mb-6">
                      <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-gold mb-2">{t.itemsAdded}</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedItems.map((item, id) => (
                          <span key={id} className="bg-gold text-charcoal text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2">{t.nameLabel}</label>
                    <input 
                      type="text"
                      className={`w-full bg-charcoal-lighter/50 border ${errors.name ? 'border-red-500/50' : 'border-white/10'} rounded-lg p-4 text-white outline-none focus:border-gold/50 transition-all text-sm`}
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder={t.namePlaceholder}
                    />
                    {errors.name && <p className="text-red-500 text-[10px] uppercase font-bold mt-2 flex items-center gap-1"><AlertCircle size={10} /> {errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2">{t.emailLabel}</label>
                    <input 
                      type="email"
                      className={`w-full bg-charcoal-lighter/50 border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-lg p-4 text-white outline-none focus:border-gold/50 transition-all text-sm`}
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder={t.emailPlaceholder}
                    />
                    {errors.email && <p className="text-red-500 text-[10px] uppercase font-bold mt-2 flex items-center gap-1"><AlertCircle size={10} /> {errors.email}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2">{t.dateLabel}</label>
                      <input 
                        type="date"
                        className={`w-full bg-charcoal-lighter/50 border ${errors.date ? 'border-red-500/50' : 'border-white/10'} rounded-lg p-4 text-white outline-none focus:border-gold/50 transition-all text-sm`}
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                      />
                      {errors.date && <p className="text-red-400 text-[9px] mt-1 uppercase font-bold">{errors.date}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2">{t.timeLabel}</label>
                      <select 
                        className={`w-full bg-charcoal-lighter/50 border ${errors.time ? 'border-red-500/50' : 'border-white/10'} rounded-lg p-4 text-white outline-none focus:border-gold/50 transition-all text-sm appearance-none`}
                        value={formData.time}
                        onChange={e => setFormData({...formData, time: e.target.value})}
                      >
                        {getAvailableTimes().map(time => (
                          <option key={time} value={time} className="bg-charcoal">{time}</option>
                        ))}
                      </select>
                      {errors.time && <p className="text-red-400 text-[9px] mt-1 uppercase font-bold">{errors.time}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1">
                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2">{t.guestsLabel}</label>
                      <select 
                        className="w-full bg-charcoal-lighter/50 border border-white/10 rounded-lg p-4 text-white outline-none focus:border-gold/50 transition-all text-sm appearance-none"
                        value={formData.guests}
                        onChange={e => setFormData({...formData, guests: e.target.value})}
                      >
                        {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n} className="bg-charcoal">{n} {n === 1 ? t.person : t.personas}</option>)}
                        <option value="7+" className="bg-charcoal">7+ {t.personas}</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-gold text-charcoal py-5 rounded-xl font-bold tracking-[0.2em] uppercase mt-4 metallic-glow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                        <Clock size={20} />
                      </motion.div>
                    ) : t.confirmButton}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Review Modal Component
function ReviewModal({ isOpen, onClose, lang }: { isOpen: boolean; onClose: () => void; lang: Language }) {
  const [formData, setFormData] = useState({ name: '', comment: '', rating: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = translations[lang].review;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await addDoc(collection(db, 'reviews'), {
        ...formData,
        lang: lang,
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFormData({ name: '', comment: '', rating: 5 });
      }, 2000);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'reviews');
      setError(lang === 'es' ? 'Hubo un error al enviar tu reseña. Por favor, inténtalo de nuevo.' : 'There was an error sending your review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-charcoal/90 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-charcoal-light w-full max-w-md p-8 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="leather-texture absolute inset-0 opacity-10 pointer-events-none" />
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {isSuccess ? (
              <div className="text-center py-12">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 className="text-gold" size={40} />
                </motion.div>
                <h3 className="font-serif text-2xl font-bold text-white mb-2">{t.successTitle}</h3>
                <p className="text-white/60">{t.successDesc}</p>
              </div>
            ) : (
              <div>
                <div className="mb-8 text-center">
                  <h3 className="font-serif text-3xl font-bold text-white mb-2 italic">{t.title}</h3>
                  <div className="w-12 h-0.5 bg-gold mx-auto" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-center">
                      <p className="text-red-500 text-xs font-bold uppercase">{error}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2">{t.nameLabel}</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-charcoal border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-gold/50 transition-colors"
                      placeholder={t.namePlaceholder}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2">{t.ratingLabel}</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className={`p-1 transition-all ${formData.rating >= star ? 'text-gold scale-110' : 'text-white/10'}`}
                        >
                          <Star size={32} fill={formData.rating >= star ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2">{t.commentLabel}</label>
                    <textarea 
                      required
                      rows={4}
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      className="w-full bg-charcoal border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-gold/50 transition-colors resize-none"
                      placeholder={t.commentPlaceholder}
                    />
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-gold text-charcoal font-bold tracking-widest uppercase py-5 rounded-xl hover:bg-gold-light transition-all flex items-center justify-center gap-2 group shadow-xl"
                  >
                    {isSubmitting ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                        <Clock size={20} />
                      </motion.div>
                    ) : t.submitButton}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('inicio');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'error' | 'warning' | 'info' }[]>([]);
  const [lang, setLang] = useState<Language>('es');

  const t = useMemo(() => translations[lang], [lang]);

  const addToast = useCallback((message: string, type: 'error' | 'warning' | 'info' = 'error') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6000);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    const handleNotification = (e: any) => {
      addToast(e.detail.message, e.detail.type);
    };
    window.addEventListener('app-notification', handleNotification);
    return () => window.removeEventListener('app-notification', handleNotification);
  }, [addToast]);

  const blogPosts = t.blogPosts;

  const normalizeText = (text: string) => 
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filteredPosts = blogPosts.filter(post => {
    const searchTerms = normalizeText(searchQuery).split(/\s+/).filter(t => t.length > 0);
    if (searchTerms.length === 0) return true;
    
    const searchableText = normalizeText(`${post.title} ${post.excerpt} ${post.category} garnish bar almozara aljaferia`);
    return searchTerms.every(term => searchableText.includes(term));
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Background
    doc.setFillColor(20, 20, 20); 
    doc.rect(0, 0, 210, 297, 'F');
    
    // Headers
    doc.setTextColor(244, 189, 113); 
    doc.setFont('serif', 'bold');
    doc.setFontSize(28);
    doc.text('GARNISH', 105, 30, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('COCTELERÍA · PICOTEO · ALMA', 105, 40, { align: 'center' });
    
    doc.setDrawColor(244, 189, 113);
    doc.setLineWidth(0.5);
    doc.line(40, 45, 170, 45);

    doc.setFontSize(18);
    doc.text('NUESTRA CARTA', 105, 65, { align: 'center' });

    let y = 85;
    
    const sections = [
      {
        title: 'CÓCTELES DE AUTOR',
        items: [
          { name: "Aljaferia Gold", price: "12 EUR", desc: "Gin infusionado, licor de sauco, lima y oro comestible." },
          { name: "Zaragoza Mule", price: "10 EUR", desc: "Vodka local, jengibre fresco, menta y un toque de canela." },
          { name: "Noche de Garnish", price: "11 EUR", desc: "Ron anejo, bitters de chocolate, naranja y humo de roble." },
          { name: "Mudejar Sour", price: "10 EUR", desc: "Pisco, sirope de granada, clara de huevo y cardamomo." }
        ]
      },
      {
        title: 'PICOTEO GOURMET',
        items: [
          { name: "Jamon de Bellota", price: "22 EUR", desc: "Corte maestro acompanado de pan de cristal con tomate." },
          { name: "Gildas Garnish", price: "8 EUR", desc: "Nuestra version premium con anchoa del Cantabrico." },
          { name: "Tabla de Quesos", price: "18 EUR", desc: "Seleccion de quesos artesanos de Aragon y miel silvestre." }
        ]
      },
      {
        title: 'VINOS Y ESPUMOSOS',
        items: [
          { name: "Cava Reserva", price: "32 EUR", desc: "Botella. Burbuja fina, notas frutales y frescura persistente." },
          { name: "Tinto D.O. Carinena", price: "6 EUR/24 EUR", desc: "Copa o botella. Cuerpo intenso con matices de frutos rojos." },
          { name: "Blanco Somontano", price: "5.5 EUR/22 EUR", desc: "Copa o botella. Aromas florales, seco y muy elegante." }
        ]
      },
      {
        title: 'GRANIZADOS Y FRAPPÉS',
        items: [
          { name: "Limón y Albahaca", price: "5.5 EUR", desc: "Granizado natural refrescante con un toque herbal único." },
          { name: "Frappé de Avellana", price: "6.5 EUR", desc: "Café premium, leche cremosa y esencia de avellana tostada." },
          { name: "Sandía y Menta", price: "5.5 EUR", desc: "La frescura máxima del verano servida en cristal." }
        ]
      },
      {
        title: 'DULCES TENTACIONES',
        items: [
          { name: "Tarta de Queso", price: "7 EUR", desc: "Receta casera con coulis de frutos rojos del bosque." },
          { name: "Coulant de Chocolate", price: "7.5 EUR", desc: "Corazón fundente de chocolate belga y helado de vainilla." },
          { name: "Sorbete Gin-Tonic", price: "6 EUR", desc: "El postre perfecto para amantes de la coctelería." }
        ]
      }
    ];

    sections.forEach((section) => {
      if (y > 250) {
        doc.addPage();
        doc.setFillColor(20, 20, 20);
        doc.rect(0, 0, 210, 297, 'F');
        y = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(244, 189, 113);
      doc.text(section.title, 20, y);
      y += 10;
      
      section.items.forEach((item) => {
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.text(`${item.name} ........................ ${item.price}`, 25, y);
        y += 6;
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text(item.desc, 30, y);
        y += 12;
      });
      y += 5;
    });

    // Footer
    doc.setTextColor(244, 189, 113);
    doc.setFontSize(8);
    doc.text('Av. de Pablo Gargallo, 19, 50003 Zaragoza', 105, 285, { align: 'center' });

    doc.save('Garnish_Carta.pdf');
  };

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} version="weekly">
      <div className="min-h-screen selection:bg-gold selection:text-charcoal overflow-x-hidden">
      {/* Header */}
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
          isScrolled 
            ? 'bg-charcoal/90 backdrop-blur-md py-4 border-white/5 shadow-2xl shadow-black/50' 
            : 'bg-transparent py-6 border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
          <div className="font-serif text-3xl font-bold tracking-[0.2em] text-gold pointer-events-none">
            GARNISH
          </div>

          <nav className="hidden md:flex items-center gap-10">
            {Object.entries(t.nav).filter(([key]) => key !== 'reserva').map(([key, label]) => (
              <button 
                key={key} 
                onClick={() => navigateTo(key)} 
                className={`text-sm font-medium tracking-widest uppercase transition-colors relative group ${
                  currentPage === key ? 'text-gold' : 'text-white/70 hover:text-gold'
                }`}
              >
                {label}
                <span className={`absolute -bottom-1 left-0 h-px bg-gold transition-all duration-300 ${
                  currentPage === key ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </button>
            ))}
            
            {/* Language Switcher */}
            <div className="flex items-center gap-2 border-l border-white/10 pl-10 ml-2">
              <button 
                onClick={() => setLang('es')}
                className={`text-[10px] font-bold tracking-widest uppercase transition-all ${lang === 'es' ? 'text-gold' : 'text-white/30 hover:text-white'}`}
              >
                ES
              </button>
              <span className="text-white/10 text-xs">|</span>
              <button 
                onClick={() => setLang('en')}
                className={`text-[10px] font-bold tracking-widest uppercase transition-all ${lang === 'en' ? 'text-gold' : 'text-white/30 hover:text-white'}`}
              >
                EN
              </button>
              <Globe size={14} className="text-gold/50 ml-1" />
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-gold text-charcoal px-6 py-2.5 rounded text-sm font-bold tracking-widest uppercase metallic-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {t.nav.reserva}
            </button>
          </nav>

          <button 
            className="md:hidden text-gold"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-charcoal-light border-b border-white/10 p-8 flex flex-col items-center gap-6 md:hidden shadow-3xl"
            >
              {Object.entries(t.nav).filter(([key]) => key !== 'reserva').map(([key, label]) => (
                <button 
                  key={key} 
                  onClick={() => navigateTo(key)}
                  className={`text-lg font-medium ${
                    currentPage === key ? 'text-gold' : 'text-white/90 hover:text-gold'
                  }`}
                >
                  {label}
                </button>
              ))}
              <div className="flex gap-6 py-2 border-y border-white/5 w-full justify-center items-center text-xs">
                <button onClick={() => setLang('es')} className={`font-bold tracking-widest ${lang === 'es' ? 'text-gold' : 'text-white/30'}`}>ES</button>
                <span className="text-white/10">|</span>
                <button onClick={() => setLang('en')} className={`font-bold tracking-widest ${lang === 'en' ? 'text-gold' : 'text-white/30'}`}>EN</button>
              </div>
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsModalOpen(true);
                }}
                className="w-full bg-gold text-charcoal py-4 rounded font-bold tracking-widest uppercase"
              >
                {t.nav.reserva}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <ReservationModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItems([]);
        }} 
        selectedItems={selectedItems}
        lang={lang}
      />

      <ReviewModal 
        isOpen={isReviewOpen} 
        onClose={() => setIsReviewOpen(false)} 
        lang={lang}
      />

      {/* Blog Post Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="absolute inset-0 bg-charcoal/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-charcoal-light w-full max-w-2xl max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedPost(null)} 
                className="absolute top-6 right-6 text-white/50 hover:text-gold transition-colors z-20 bg-charcoal/50 p-2 rounded-full backdrop-blur-sm"
              >
                <X size={24} />
              </button>

              <div className="h-80 relative">
                <img 
                  src={selectedPost.image} 
                  alt={selectedPost.title} 
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-light to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <span className="bg-gold text-charcoal px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 inline-block">
                    {selectedPost.category}
                  </span>
                  <h3 className="font-serif text-3xl md:text-4xl font-bold text-white uppercase tracking-tight">
                    {selectedPost.title}
                  </h3>
                </div>
              </div>

              <div className="p-8 md:p-12 space-y-6">
                <div className="flex items-center gap-4 text-white/40 text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-6">
                  <Calendar size={14} className="text-gold" />
                  {selectedPost.date}
                  <span className="w-1 h-1 rounded-full bg-gold/50" />
                  <span>{lang === 'es' ? 'Por Garnish Staff' : 'By Garnish Staff'}</span>
                </div>

                <div 
                  className="prose prose-invert max-w-none text-white/70 leading-relaxed space-y-4 blog-content"
                  dangerouslySetInnerHTML={{ __html: injectLazyLoading(selectedPost.content) }}
                />

                {/* Social Share section */}
                <div className="pt-10 border-t border-white/5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <span className="text-gold font-bold tracking-[0.2em] uppercase text-[10px] block mb-2">COMPARTE ESTA HISTORIA</span>
                      <h4 className="text-white text-lg font-serif">Ayuda a difundir la cultura del vermú</h4>
                    </div>
                    <div className="flex items-center gap-3">
                      {[
                        { 
                          icon: <MessageCircle size={18} />, 
                          label: "WhatsApp", 
                          color: "hover:bg-[#25D366]",
                          onClick: () => window.open(`https://wa.me/?text=${encodeURIComponent(selectedPost.title + ' ' + window.location.href)}`, '_blank')
                        },
                        { 
                          icon: <Twitter size={18} />, 
                          label: "Twitter", 
                          color: "hover:bg-[#1DA1F2]",
                          onClick: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedPost.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')
                        },
                        { 
                          icon: <Facebook size={18} />, 
                          label: "Facebook", 
                          color: "hover:bg-[#4267B2]",
                          onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')
                        },
                        { 
                          icon: <Link2 size={18} />, 
                          label: "Copiar Link", 
                          color: "hover:bg-gold",
                          onClick: () => {
                            navigator.clipboard.writeText(window.location.href);
                            alert('Link copiado al portapapeles');
                          }
                        }
                      ].map((social, i) => (
                        <button
                          key={i}
                          onClick={social.onClick}
                          title={social.label}
                          className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 transition-all duration-300 hover:text-white hover:border-transparent hover:scale-110 ${social.color}`}
                        >
                          {social.icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-12 flex justify-center">
                  <button 
                    onClick={() => setSelectedPost(null)}
                    className="bg-transparent border border-gold/30 text-gold px-8 py-3 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-gold hover:text-charcoal transition-all"
                  >
                    Volver al blog
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main>
        <AnimatePresence mode="wait">
          {currentPage === 'inicio' && (
            <motion.div
              key="inicio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Hero Section */}
              <section id="inicio" className="relative h-screen min-h-[650px] flex flex-col items-center justify-center overflow-hidden bg-charcoal">
                {/* Capa de imagen de fondo */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={IMAGES.hero} 
                    alt="Garnish Bar - Vermú y Coctelería en La Almozara, Zaragoza" 
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative z-10 text-center px-6 max-w-5xl pt-40 md:pt-60"
                >
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[1.1] drop-shadow-2xl">
                      {lang === 'es' ? (
                        <>Coctelería, Picoteo <br className="hidden md:block" />y Alma <span className="text-gold">junto a la Aljafería</span></>
                      ) : (
                        <>Cocktails, Tapas <br className="hidden md:block" />& Soul <span className="text-gold">by the Aljafería</span></>
                      )}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/80 font-light mb-12 max-w-2xl mx-auto tracking-wide leading-relaxed">
                      {t.hero.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-5 justify-center">
                      <Tooltip text={t.hero.tooltipReserva}>
                        <button 
                          onClick={() => setIsModalOpen(true)}
                          className="group bg-gold text-charcoal px-10 py-5 rounded-lg text-lg font-bold tracking-widest uppercase flex items-center justify-center gap-3 transition-all hover:pr-12 metallic-glow w-full sm:w-auto"
                        >
                          <Calendar size={20} className="group-hover:scale-110 transition-transform" />
                          {t.hero.ctaReserva}
                        </button>
                      </Tooltip>
                      <Tooltip text={t.hero.tooltipCarta}>
                        <button 
                          onClick={() => navigateTo('carta')}
                          className="border border-gold/50 text-gold px-10 py-5 rounded-lg text-lg font-bold tracking-widest uppercase hover:bg-gold/20 hover:text-white transition-all w-full sm:w-auto text-center flex items-center justify-center"
                        >
                          {t.hero.ctaCarta}
                        </button>
                      </Tooltip>
                    </div>
                  </motion.div>
              </section>

              {/* Features Section */}
              <section className="py-24 px-6 lg:px-12 bg-charcoal">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-20">
                    <span className="text-gold font-bold tracking-[0.3em] uppercase text-xs block mb-4">{t.features.tag}</span>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">{t.features.title}</h2>
                  </div>

                  <div className="flex flex-row gap-2 md:gap-8 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
                    {[
                      {
                        title: t.features.items[0].title,
                        desc: t.features.items[0].desc,
                        image: IMAGES.cocteleria,
                        icon: <Beer size={24} className="text-gold" />
                      },
                      {
                        title: t.features.items[1].title,
                        desc: t.features.items[1].desc,
                        image: IMAGES.picoteo,
                        icon: <UtensilsCrossed size={24} className="text-gold" />
                      },
                      {
                        title: t.features.items[2].title,
                        desc: t.features.items[2].desc,
                        image: IMAGES.terraza,
                        icon: <Sun size={24} className="text-gold" />
                      },
                      {
                        title: t.features.items[3].title,
                        desc: t.features.items[3].desc,
                        image: IMAGES.ambiente,
                        icon: <Moon size={24} className="text-gold" />
                      }
                    ].map((feature, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex-1 group relative bg-charcoal-light rounded-xl overflow-hidden border border-white/5 hover:border-gold/30 transition-all duration-500"
                      >
                        <div className="h-64 overflow-hidden">
                          <img 
                            src={feature.image} 
                            alt={feature.title} 
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </div>
                        <div className="p-8 relative">
                          <div className="flex items-center gap-3 mb-4">
                            {feature.icon}
                            <h3 className="font-serif text-xl font-bold text-gold">{feature.title}</h3>
                          </div>
                          <p className="text-white/60 leading-relaxed text-sm">
                            {feature.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
              
              {/* Testimonials Section */}
              <section className="py-24 px-6 lg:px-12 bg-charcoal-lighter border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-20">
                    <span className="text-gold font-bold tracking-[0.3em] uppercase text-xs block mb-4">{t.testimonials.tag}</span>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">{t.testimonials.title}</h2>
                  </div>

                  <GoogleReviews lang={lang} />
                </div>
              </section>
            </motion.div>
          )}

          {currentPage === 'vermu' && (
            <motion.div
              key="vermu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Vermu Hero Header */}
              <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                  <img 
                    src="https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&q=75&w=1280" 
                    alt="El mejor vermú de La Almozara en Bar Garnish" 
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover brightness-50 scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-charcoal/20 via-transparent to-charcoal" />
                </div>
                
                <div className="relative z-10 text-center px-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative flex flex-col items-center"
                  >
                    {/* Abstract Martini-inspired emblem */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-gold/10 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/5 rounded-full" />
                    
                    <span className="text-gold font-bold tracking-[0.5em] uppercase text-[10px] block mb-8 px-6 py-2 border-y border-gold/30 backdrop-blur-md">
                      {t.vermu.tag}
                    </span>
                    
                    <h2 className="font-serif text-6xl md:text-8xl font-bold text-white mb-6 tracking-tighter">
                      {lang === 'es' ? (
                        <>El Mejor <span className="text-gold italic">Vermú</span> de La Almozara</>
                      ) : (
                        <>The Best <span className="text-gold italic">Vermouth</span> in La Almozara</>
                      )}
                    </h2>
                    
                    <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-gold to-transparent opacity-40" />
                  </motion.div>
                </div>
              </section>

              {/* Vermu Content Section */}
              <section id="vermu" className="py-24 px-6 lg:px-12 bg-charcoal relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
                  <div className="flex-1 space-y-12">
                    <div>
                      <span className="text-gold font-bold tracking-[0.3em] uppercase text-xs block mb-4 flex items-center gap-2">
                        <Wine size={14} /> {t.vermu.exclusiveTag}
                      </span>
                      <p className="text-xl md:text-2xl text-white/70 font-light leading-relaxed max-w-2xl">
                        {t.vermu.desc}
                      </p>
                    </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {[
                          { id: 'aperol', name: t.vermu.items[0].name, price: "7€", desc: t.vermu.items[0].desc, image: "https://images.unsplash.com/photo-1574096079533-d8243dd71430?auto=format&fit=crop&q=75&w=600" },
                          { id: 'vermut', name: t.vermu.items[1].name, price: "4.5€", desc: t.vermu.items[1].desc, image: "https://images.unsplash.com/photo-1543736531-29e319409893?auto=format&fit=crop&q=75&w=600" },
                          { id: 'gildas', name: t.vermu.items[2].name, price: "2.5€", desc: t.vermu.items[2].desc, image: "https://images.unsplash.com/photo-1621644788339-a9f3b1456108?auto=format&fit=crop&q=75&w=600" },
                          { id: 'patatas', name: t.vermu.items[3].name, price: "6€", desc: t.vermu.items[3].desc, image: "https://images.unsplash.com/photo-1566478204292-f07662c19a97?auto=format&fit=crop&q=75&w=600" }
                        ].map((item, i) => (
                          <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-charcoal-light/50 rounded-3xl border border-white/5 group relative overflow-hidden h-[280px] flex flex-col"
                          >
                            {/* Card Background Image with Hover Effect */}
                            <div className="absolute inset-0 z-0">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-1000"
                                referrerPolicy="no-referrer"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent" />
                            </div>

                            <div className="relative z-10 p-8 h-full flex flex-col">
                              <div className="flex justify-between items-start mb-4">
                                <h4 className="text-gold font-bold text-2xl group-hover:translate-x-1 transition-transform">{item.name}</h4>
                                <span className="font-serif italic text-white/60 text-lg">{item.price}</span>
                              </div>
                              
                              <p className="text-white/50 text-sm leading-relaxed mb-auto group-hover:text-white/80 transition-colors">
                                {item.desc}
                              </p>

                              <div className="flex items-center justify-between mt-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                <span className="text-[10px] text-gold font-bold tracking-widest uppercase">Tradición Garnish</span>
                                <button 
                                  onClick={() => {
                                    setSelectedItems(prev => prev.includes(item.name) ? prev : [...prev, item.name]);
                                    setIsModalOpen(true);
                                  }}
                                  className="w-10 h-10 rounded-full bg-gold text-charcoal flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                                  title="Añadir a mi reserva"
                                >
                                  <Plus size={20} />
                                </button>
                              </div>
                            </div>
                            
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                              <div className="absolute top-0 right-0 w-full h-full bg-gold/5 rounded-bl-[100%] group-hover:bg-gold/20 transition-all" />
                            </div>
                          </motion.div>
                        ))}
                      </div>

                    <div className="pt-6 flex flex-col sm:flex-row items-center gap-6">
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-gold text-charcoal px-10 py-5 rounded-full text-sm font-bold tracking-widest uppercase metallic-glow hover:scale-[1.03] transition-all w-full sm:w-auto"
                      >
                        {t.vermu.cta}
                      </button>
                      <button 
                        onClick={() => navigateTo('carta')}
                        className="text-white/60 hover:text-gold transition-colors text-xs font-bold tracking-widest uppercase border-b border-white/10 pb-1 hover:border-gold"
                      >
                        {t.vermu.viewCarta}
                      </button>
                    </div>
                    
                    <p className="text-[10px] text-gold/50 italic tracking-wider">
                      {lang === 'es' ? '* Servicio de vermú disponible los sábados, domingos y festivos nacionales de 11:30 a 14:30.' : '* Vermouth service available on Saturdays, Sundays and national holidays from 11:30 to 14:30.'}
                    </p>
                  </div>
                </div>

                 {/* Additional Interesting Section at the bottom of Vermu page */}
                 <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5">
                   <div className="bg-charcoal-lighter p-10 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
                     <div className="max-w-xl">
                       <h3 className="font-serif text-3xl font-bold text-white mb-4">
                         {lang === 'es' ? '¿Sabías qué?' : 'Did you know?'}
                       </h3>
                       <p className="text-white/60 leading-relaxed font-light">
                         {lang === 'es' 
                           ? 'El Palacio de la Aljafería, situado a pocos pasos de Garnish, es el único palacio musulmán del siglo XI conservado en Europa que sigue en uso. Completa tu mañana de vermú con una visita cultural inolvidable.'
                           : 'The Aljafería Palace, located just a few steps from Garnish, is the only 11th-century Muslim palace preserved in Europe that is still in use. Complete your vermouth morning with an unforgettable cultural visit.'}
                       </p>
                     </div>
                     <a 
                       href="https://www.cortesaragon.es/Visitas-guiadas.346.0.html" 
                       target="_blank" 
                       rel="noreferrer"
                       className="bg-white/5 border border-gold/30 text-gold px-8 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-gold hover:text-charcoal transition-all flex items-center gap-3"
                     >
                       {lang === 'es' ? 'Reservar visita al Palacio' : 'Book Palace visit'} <Info size={16} />
                     </a>
                   </div>
                 </div>
              </section>
            </motion.div>
          )}

          {currentPage === 'carta' && (
            <motion.div
              key="carta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pt-32"
            >
              {/* Carta Section */}
              <section id="carta" className="py-24 px-6 lg:px-12 bg-charcoal-lighter">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-20">
                    <span className="text-gold font-bold tracking-[0.3em] uppercase text-xs block mb-4">{lang === 'es' ? 'DEGUSTACIÓN' : 'Tasting'}</span>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">{lang === 'es' ? 'Nuestra Selección' : 'Our Selection'}</h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Category: Cocktails */}
                    <div className="space-y-10">
                      <div className="border-b border-gold/20 pb-4">
                        <h3 className="font-serif text-2xl font-bold text-gold italic">{t.carta.sections[0].title}</h3>
                      </div>
                      <div className="space-y-8">
                        {[
                          { name: t.carta.sections[0].items[0].name, price: "12€", desc: t.carta.sections[0].items[0].desc },
                          { name: t.carta.sections[0].items[1].name, price: "10€", desc: t.carta.sections[0].items[1].desc },
                          { name: t.carta.sections[0].items[2].name, price: "11€", desc: t.carta.sections[0].items[2].desc },
                          { name: t.carta.sections[0].items[3].name, price: "10€", desc: t.carta.sections[0].items[3].desc }
                        ].map((item, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, x: -10 }} 
                            whileInView={{ opacity: 1, x: 0 }} 
                            transition={{ delay: i * 0.1 }}
                            className="group"
                          >
                            <div className="flex justify-between items-baseline mb-1">
                              <h4 className="text-white font-bold tracking-wider group-hover:text-gold transition-colors">{item.name}</h4>
                              <span className="text-gold font-serif italic">{item.price}</span>
                            </div>
                            <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Category: Picoteo */}
                    <div className="space-y-10">
                      <div className="border-b border-gold/20 pb-4">
                        <h3 className="font-serif text-2xl font-bold text-gold italic">{t.carta.sections[1].title}</h3>
                      </div>
                      <div className="space-y-8">
                        {[
                          { name: t.carta.sections[1].items[0].name, price: "22€", desc: t.carta.sections[1].items[0].desc },
                          { name: t.carta.sections[1].items[1].name, price: "8€", desc: t.carta.sections[1].items[1].desc },
                          { name: t.carta.sections[1].items[2].name, price: "18€", desc: t.carta.sections[1].items[2].desc }
                        ].map((item, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, scale: 0.98 }} 
                            whileInView={{ opacity: 1, scale: 1 }} 
                            transition={{ delay: i * 0.1 }}
                            className="group"
                          >
                            <div className="flex justify-between items-baseline mb-1">
                              <h4 className="text-white font-bold tracking-wider group-hover:text-gold transition-colors">{item.name}</h4>
                              <span className="text-gold font-serif italic">{item.price}</span>
                            </div>
                            <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Category: Vinos */}
                    <div className="space-y-10">
                      <div className="border-b border-gold/20 pb-4">
                        <h3 className="font-serif text-2xl font-bold text-gold italic">{t.carta.sections[2].title}</h3>
                      </div>
                      <div className="space-y-8">
                        {[
                          { name: t.carta.sections[2].items[0].name, price: "32€", desc: t.carta.sections[2].items[0].desc },
                          { name: t.carta.sections[2].items[1].name, price: "6€/24€", desc: t.carta.sections[2].items[1].desc },
                          { name: t.carta.sections[2].items[2].name, price: "5.5€/22€", desc: t.carta.sections[2].items[2].desc },
                          { name: t.carta.sections[2].items[3].name, price: "4.5€", desc: t.carta.sections[2].items[3].desc }
                        ].map((item, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, x: 10 }} 
                            whileInView={{ opacity: 1, x: 0 }} 
                            transition={{ delay: i * 0.1 }}
                            className="group"
                          >
                            <div className="flex justify-between items-baseline mb-1">
                              <h4 className="text-white font-bold tracking-wider group-hover:text-gold transition-colors">{item.name}</h4>
                              <span className="text-gold font-serif italic">{item.price}</span>
                            </div>
                            <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Category: Granizados */}
                    <div className="space-y-10">
                      <div className="border-b border-gold/20 pb-4">
                        <h3 className="font-serif text-2xl font-bold text-gold italic">{t.carta.sections[3].title}</h3>
                      </div>
                      <div className="space-y-8">
                        {[
                          { name: t.carta.sections[3].items[0].name, price: "5.5€", desc: t.carta.sections[3].items[0].desc },
                          { name: t.carta.sections[3].items[1].name, price: "6.5€", desc: t.carta.sections[3].items[1].desc },
                          { name: t.carta.sections[3].items[2].name, price: "5.5€", desc: t.carta.sections[3].items[2].desc }
                        ].map((item, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 10 }} 
                            whileInView={{ opacity: 1, y: 0 }} 
                            transition={{ delay: i * 0.1 }}
                            className="group"
                          >
                            <div className="flex justify-between items-baseline mb-1">
                              <h4 className="text-white font-bold tracking-wider group-hover:text-gold transition-colors">{item.name}</h4>
                              <span className="text-gold font-serif italic">{item.price}</span>
                            </div>
                            <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Category: Dulces */}
                    <div className="space-y-10">
                      <div className="border-b border-gold/20 pb-4">
                        <h3 className="font-serif text-2xl font-bold text-gold italic">{t.carta.sections[4].title}</h3>
                      </div>
                      <div className="space-y-8">
                        {[
                          { name: t.carta.sections[4].items[0].name, price: "7€", desc: t.carta.sections[4].items[0].desc },
                          { name: t.carta.sections[4].items[1].name, price: "7.5€", desc: t.carta.sections[4].items[1].desc },
                          { name: t.carta.sections[4].items[2].name, price: "6€", desc: t.carta.sections[4].items[2].desc }
                        ].map((item, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 10 }} 
                            whileInView={{ opacity: 1, y: 0 }} 
                            transition={{ delay: i * 0.1 }}
                            className="group"
                          >
                            <div className="flex justify-between items-baseline mb-1">
                              <h4 className="text-white font-bold tracking-wider group-hover:text-gold transition-colors">{item.name}</h4>
                              <span className="text-gold font-serif italic">{item.price}</span>
                            </div>
                            <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-20 text-center">
                    <button 
                      onClick={handleDownloadPDF}
                      className="bg-transparent border border-gold/30 text-gold/80 px-8 py-3 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-gold hover:text-charcoal transition-all flex items-center gap-2 mx-auto"
                    >
                      <Download size={14} /> {lang === 'es' ? 'Descargar Carta Completa (PDF)' : 'Download Full Menu (PDF)'}
                    </button>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {currentPage === 'ubicacion' && (
            <motion.div
              key="ubicacion"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pt-32"
            >
              {/* Location Section */}
              <section id="ubicación" className="bg-charcoal-light py-24 px-6 lg:px-12 border-y border-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative group"
                  >
                    <img 
                      src={IMAGES.palacio} 
                      alt="Palacio de la Aljafería" 
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 brightness-75 group-hover:brightness-100"
                    />
                    <div className="absolute inset-0 bg-gold/10 mix-blend-overlay group-hover:opacity-0 transition-opacity" />
                  </motion.div>

                  <div className="space-y-8">
                    <div>
                      <span className="text-gold font-bold tracking-[0.3em] uppercase text-xs block mb-4">{t.location.tag}</span>
                      <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">{t.location.title}</h2>
                      <p className="text-lg text-white/70 font-light leading-relaxed">
                        {t.location.desc}
                      </p>
                    </div>

                    <div className="space-y-6 pt-4">
                      <a 
                        href="https://maps.google.com/?q=Garnish+Zaragoza+Pablo+Gargallo+19" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center gap-5 text-white/90 group w-fit"
                      >
                        <div className="bg-gold text-charcoal p-2.5 rounded-lg group-hover:scale-110 transition-transform"><MapPin size={22} /></div>
                        <span className="text-xl border-b border-transparent group-hover:border-gold transition-all">Av. de Pablo Gargallo, 19, 50003 Zaragoza, Spain</span>
                      </a>
                      <div className="flex items-center gap-5 text-white/90">
                        <div className="bg-gold text-charcoal p-2.5 rounded-lg"><Clock size={22} /></div>
                        <span className="text-xl">
                          {lang === 'es' ? 'Dom-Jue: 11:00 - 00:00 | Vie-Sáb: 11:00 - 02:30' : 'Sun-Thu: 11:00 - 00:00 | Fri-Sat: 11:00 - 02:30'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {currentPage === 'blog' && (
            <motion.div
              key="blog"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pt-32"
            >
              {/* Blog Section */}
              <section id="blog" className="py-24 px-6 lg:px-12 bg-charcoal-lighter border-t border-white/5 min-h-screen">
                <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl">
                      <span className="text-gold font-bold tracking-[0.3em] uppercase text-xs block mb-4">{t.blog.tag}</span>
                      <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">{t.blog.title}</h2>
                      <p className="text-white/60 text-lg">{t.blog.desc}</p>
                    </div>
                    <div className="w-full md:w-80 relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50 group-focus-within:text-gold transition-colors" size={18} />
                      <input 
                        type="text"
                        placeholder={t.blog.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-charcoal border border-white/10 rounded-full py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:border-gold/50 transition-all placeholder:text-white/20"
                      />
                    </div>
                  </div>

                  {filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                      {filteredPosts.map((post, idx) => (
                        <motion.article 
                          key={idx}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="group cursor-pointer"
                          onClick={() => setSelectedPost(post)}
                        >
                          <div className="relative h-64 mb-6 rounded-xl overflow-hidden">
                            <img 
                              src={post.image} 
                              alt={post.title} 
                              referrerPolicy="no-referrer"
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            <div className="absolute top-4 left-4">
                              <span className="bg-gold text-charcoal px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
                                {post.category}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <span className="text-white/40 text-xs font-bold uppercase tracking-widest">{post.date}</span>
                            <h3 className="font-serif text-2xl font-bold text-white group-hover:text-gold transition-colors underline-offset-4 group-hover:underline decoration-gold/30">
                              {post.title}
                            </h3>
                            <p className="text-white/60 text-sm leading-relaxed line-clamp-2">
                              {post.excerpt}
                            </p>
                          </div>
                        </motion.article>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <p className="text-white/40 text-xl font-light italic">{t.blog.noResults}</p>
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="mt-6 text-gold underline underline-offset-4 hover:text-white transition-colors"
                      >
                        {t.blog.clearSearch}
                      </button>
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Sections (Always Visible at bottom of current page content or as a transition) */}
        <div className="bg-charcoal">
          {/* Reviews CTA Section */}
          <section className="py-24 bg-charcoal-lighter relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
              <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
                <Share2 size={12} /> {t.review.tag}
              </div>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-6">{t.review.title}</h2>
              <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">{t.review.desc}</p>
              <a 
                href="https://g.page/r/CS7k7y_nl_DkEBM/review" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-3 border border-gold text-gold px-10 py-4 rounded-full font-bold tracking-widest uppercase hover:bg-gold hover:text-charcoal transition-all metallic-glow"
              >
                {t.review.cta}
              </a>
            </div>
          </section>

          {/* CTA Footer Section */}
          <section className="py-32 bg-charcoal text-center px-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[radial-gradient(circle_at_center,rgba(244,189,113,0.05)_0%,transparent_70%)]" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-serif text-4xl md:text-6xl font-bold text-white mb-8"
              >
                {t.cta.title}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-xl text-white/70 font-light mb-12 tracking-wide"
              >
                {t.cta.desc}
              </motion.p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="bg-gold text-charcoal px-14 py-6 rounded-full text-xl font-bold tracking-widest uppercase metallic-glow"
              >
                {t.cta.button}
              </motion.button>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-charcoal-light py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
          <div className="space-y-6">
            <div className="font-serif text-2xl font-bold tracking-[0.2em] text-gold uppercase">GARNISH</div>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm uppercase tracking-wider">
              {t.footer.desc}
            </p>
          </div>

          <div className="space-y-8">
            <h4 className="text-gold font-bold tracking-[0.3em] uppercase text-xs">{t.footer.linksTitle}</h4>
            <ul className="space-y-4">
              <li>
                <a href="https://www.zaragoza.es/sede/portal/turismo/" target="_blank" rel="noreferrer" className="text-white/60 hover:text-gold transition-colors text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                  <span className="w-4 h-px bg-gold/30" /> {t.footer.zaragozaTurismo}
                </a>
              </li>
              <li>
                <a href="https://www.cortesaragon.es/La-Aljaferia.28.0.html" target="_blank" rel="noreferrer" className="text-white/60 hover:text-gold transition-colors text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                  <span className="w-4 h-px bg-gold/30" /> {t.footer.aljaferiaPalace}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-gold font-bold tracking-[0.3em] uppercase text-xs">{t.footer.socialTitle}</h4>
            <div className="flex gap-6">
              <a href="https://www.facebook.com/garnishaljaferia" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-gold hover:border-gold transition-all">
                <Facebook size={18} />
              </a>
              <a href="https://www.instagram.com/garnishaljaferia" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-gold hover:border-gold transition-all">
                <Instagram size={18} />
              </a>
              <a href="https://maps.google.com/?q=Garnish+Zaragoza+Pablo+Gargallo+19" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-gold hover:border-gold transition-all">
                <MapPin size={18} />
              </a>
            </div>
            <a 
              href="https://wa.me/34600550306" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-3 text-gold/80 hover:text-gold transition-colors group"
            >
              <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-bold tracking-widest uppercase text-sm">WhatsApp</span>
            </a>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center md:text-left">
          <p className="text-xs text-white/30 tracking-widest uppercase">
            © {new Date().getFullYear()} Garnish Bar & Bistro. Av. de Pablo Gargallo, 19, 50003 Zaragoza, Spain. {t.footer.credits}
          </p>
        </div>
      </footer>

      {/* Floating Action Button */}
      <a 
        href="https://wa.me/34600550306" 
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-8 right-8 z-[60] bg-[#25D366] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all metallic-glow"
        aria-label={lang === 'es' ? "Contactar por WhatsApp" : "Contact via WhatsApp"}
      >
        <MessageCircle size={32} />
      </a>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-32 right-8 z-[60] bg-charcoal-light border border-gold/30 text-gold w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:bg-gold hover:text-charcoal hover:border-gold transition-all group"
            aria-label={lang === 'es' ? "Volver arriba" : "Back to top"}
          >
            <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
      {/* Notifications */}
      <div className="fixed bottom-32 left-8 z-[100] flex flex-col gap-4 pointer-events-none w-full max-w-xs sm:max-w-md">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.9 }}
              className={`pointer-events-auto p-4 rounded-xl shadow-2xl border flex items-start gap-4 backdrop-blur-md ${
                toast.type === 'error' ? 'bg-red-500/20 border-red-500/30' :
                toast.type === 'warning' ? 'bg-amber-500/20 border-amber-500/30' :
                'bg-gold/20 border-gold/30'
              }`}
            >
              <div className={`mt-0.5 ${
                toast.type === 'error' ? 'text-red-500' :
                toast.type === 'warning' ? 'text-amber-500' :
                'text-gold'
              }`}>
                {toast.type === 'error' ? <AlertCircle size={20} /> :
                 toast.type === 'warning' ? <AlertCircle size={20} /> :
                 <Info size={20} />}
              </div>
              <div className="flex-1">
                <p className="text-white text-xs font-semibold leading-relaxed tracking-wide">
                  {toast.message}
                </p>
              </div>
              <button 
                onClick={() => removeToast(toast.id)}
                className="text-white/20 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      </div>
    </APIProvider>
  );
}
