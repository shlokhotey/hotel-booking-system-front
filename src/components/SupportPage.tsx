import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, Mail, Phone, MessageSquare, ChevronRight, FileText, Shield, LifeBuoy } from 'lucide-react';

const FAQ_ITEMS = [
  { q: 'How do I cancel my booking?', a: 'You can cancel your booking from the "My Bookings" section. Most rooms offer free cancellation up to 48 hours before check-in.' },
  { q: 'Can I pay at the hotel?', a: 'Payment options depend on the hotel. Some require upfront payment, while others allow you to pay upon arrival.' },
  { q: 'What if I need an extra bed?', a: 'You can request additional services by contacting the hotel directly through the support chat once your booking is confirmed.' },
];

export const SupportPage: React.FC = () => {
  return (
    <div className="flex-1 bg-bg-light p-10">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <LifeBuoy className="text-brand-primary w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-text-main tracking-tight uppercase">Support Center</h1>
          <p className="text-text-muted font-bold uppercase tracking-widest text-xs">How can we help you plan your journey?</p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-xl border border-border-theme shadow-sm text-center">
            <Mail className="w-6 h-6 text-brand-primary mx-auto mb-4" />
            <h4 className="text-xs font-black text-text-main uppercase mb-2 tracking-widest">Email Us</h4>
            <p className="text-[10px] font-bold text-text-muted">support@stayflow.com</p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-xl border border-border-theme shadow-sm text-center">
            <Phone className="w-6 h-6 text-brand-primary mx-auto mb-4" />
            <h4 className="text-xs font-black text-text-main uppercase mb-2 tracking-widest">Call Us</h4>
            <p className="text-[10px] font-bold text-text-muted">+91 123 456 7890</p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-xl border border-border-theme shadow-sm text-center">
            <MessageSquare className="w-6 h-6 text-brand-primary mx-auto mb-4" />
            <h4 className="text-xs font-black text-text-main uppercase mb-2 tracking-widest">Live Chat</h4>
            <p className="text-[10px] font-bold text-text-muted italic">24/7 Availability</p>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl border border-border-theme p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-5 h-5 text-brand-primary" />
            <h3 className="text-lg font-black text-text-main uppercase tracking-tighter">Frequently Asked Questions</h3>
          </div>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="border-b border-border-theme last:border-0 pb-4 last:pb-0 pt-2">
                <div className="flex justify-between items-center cursor-pointer group">
                  <span className="text-sm font-bold text-text-main group-hover:text-brand-primary transition-colors">{item.q}</span>
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-text-muted mt-2 font-medium leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="flex items-center gap-4 bg-white p-6 rounded-xl border border-border-theme shadow-sm">
             <FileText className="text-brand-primary w-6 h-6" />
             <div>
                <h5 className="text-xs font-black text-text-main uppercase tracking-widest">Terms of Service</h5>
                <p className="text-[10px] text-text-muted uppercase font-bold tracking-tight">Read our policies</p>
             </div>
           </div>
           <div className="flex items-center gap-4 bg-white p-6 rounded-xl border border-border-theme shadow-sm">
             <Shield className="text-brand-primary w-6 h-6" />
             <div>
                <h5 className="text-xs font-black text-text-main uppercase tracking-widest">Privacy Center</h5>
                <p className="text-[10px] text-text-muted uppercase font-bold tracking-tight">Manage your data</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
