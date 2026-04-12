'use client';

import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 pt-32 pb-20 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tighter uppercase">Get in Touch</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Have questions, feedback, or just want to talk about movies? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold">Email Us</p>
                <p className="text-muted-foreground">support@movieworld.example.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold">Call Us</p>
                <p className="text-muted-foreground">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold">Visit Us</p>
                <p className="text-muted-foreground">123 Cinema Lane, Hollywood, CA 90210</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-secondary/20 p-8 rounded-2xl border border-muted/20 space-y-6">
          <h2 className="text-2xl font-bold">Send us a Message</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input placeholder="John" className="bg-background border-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input placeholder="Doe" className="bg-background border-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input type="email" placeholder="john@example.com" className="bg-background border-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <textarea 
                className="w-full min-h-[150px] bg-background rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Tell us what's on your mind..."
              />
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12">
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
